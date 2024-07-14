<!-- src/components/ui/Sidebar/Index.vue -->
<template>
  <aside :class="['sidebar', { 'sidebar-visible': isSidebarOpen }]">
    <div class="sidebar-header">
      <h2 class="text-lg font-semibold">Menu</h2>
      <button @click="closeSidebar" class="close-btn">
        <i class="i-mdi-close text-2xl"></i>
      </button>
    </div>
    <nav>
      <ul class="sidebar-menu">
        <li v-for="item in menuItems" :key="item.url" :class="{ 'has-submenu': item.children && item.children.length, 'active': isActive(item) }">
          <div class="menu-item">
            <a :href="item.url" @click="navigateTo($event, item)">{{ item.label }}</a>
            <button v-if="item.children && item.children.length" @click="toggleSubmenu(item)" class="submenu-toggle">
              <i :class="isActive(item) ? 'i-mdi-chevron-up' : 'i-mdi-chevron-down'"></i>
            </button>
          </div>
          <ul v-if="item.children && item.children.length" class="sidebar-submenu" :class="{ 'active': isActive(item) }">
            <li v-for="subItem in item.children" :key="subItem.url">
              <a :href="subItem.url" @click="navigateTo($event, subItem)">{{ subItem.label }}</a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { navigate } from 'astro:transitions/client';
import { computed, ref, onMounted } from 'vue';
import { useStore } from '@nanostores/vue';
import { $display, toggleSidebar } from '@/store/display';

interface MenuItem {
  label: string;
  url: string;
  children?: MenuItem[];
}

const props = defineProps({
  menuItems: {
    type: Array as () => MenuItem[],
    required: true,
  },
});

console.log('menuItems', props.menuItems);

const displayStore = useStore($display);
const isSidebarOpen = computed(() => displayStore.value.isSidebarOpen);

const activeItems = ref<Set<MenuItem>>(new Set());

function isActive(item: MenuItem): boolean {
  return activeItems.value.has(item);
}

function toggleSubmenu(item: MenuItem) {
  if (item.children && item.children.length) {
    if (activeItems.value.has(item)) {
      activeItems.value.delete(item);
    } else {
      activeItems.value.add(item);
    }
  }
}

function navigateTo(event: Event, item: MenuItem) {
  event.preventDefault();
  navigate(item.url);
  closeSidebar();
}

function closeSidebar() {
  toggleSidebar();
}

onMounted(() => {
  updateActiveItems();
  window.addEventListener('popstate', updateActiveItems);
});

function updateActiveItems() {
  const currentPath = window.location.pathname;
  activeItems.value.clear();
  props.menuItems.forEach(item => {
    if (currentPath.startsWith(item.url)) {
      activeItems.value.add(item);
    }
  });
}
</script>

<style scoped>
.sidebar {
  grid-area: sidebar;
  background-color: var(--accent-tertiary);
  color: var(--text-main);
  overflow-y: auto;
  width: 0;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  transition: all 0.3s ease;
  z-index: 20;
  display: flex;
  flex-direction: column;
}

.sidebar-visible {
  width: 250px;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--accent-secondary);
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-main);
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0.5rem;
  transition: color 0.3s ease;
}

.close-btn:hover {
  color: var(--accent-primary);
}

.sidebar-menu {
  list-style-type: none;
  padding: 1rem;
  margin: 0;
}

.sidebar-menu li {
  margin-bottom: 0.5rem;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.menu-item a {
  flex-grow: 1;
  padding: 0.5rem;
  color: var(--text-main);
  text-decoration: none;
  transition: color 0.3s ease, background-color 0.3s ease;
}

.menu-item a:hover {
  color: var(--accent-primary);
  background-color: rgba(0, 0, 0, 0.1);
}

.submenu-toggle {
  background: none;
  border: none;
  color: var(--text-main);
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.3s ease;
}

.submenu-toggle:hover {
  color: var(--accent-primary);
}

.sidebar-submenu {
  padding-left: 1rem;
  display: none;
}

.sidebar-submenu.active {
  display: block;
}

.sidebar-menu .has-submenu > .menu-item > a {
  font-weight: bold;
}

.sidebar-submenu a {
  padding-left: 1.5rem;
}

@media (min-width: 767px) {
  .sidebar {
    position: relative;
    height: auto;
  }
}
</style>