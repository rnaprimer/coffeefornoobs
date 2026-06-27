import Link from 'next/link'
import { 
  LayoutDashboard, 
  Package, 
  BookOpen, 
  Coffee, 
  Users, 
  Settings, 
  LogOut,
  Tag,
  Store,
  Layers,
  ArrowRightLeft,
  Hash
} from 'lucide-react'
import { logout } from '@/actions/auth'

const navigation = [
  { name: 'Media Library', href: '/admin/media', icon: LayoutDashboard },
  { name: 'Homepage CMS', href: '/admin/homepage', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Brands', href: '/admin/brands', icon: Tag },
  { name: 'Categories', href: '/admin/categories', icon: Layers },
  { name: 'Tags', href: '/admin/tags', icon: Hash },
  { name: 'Learn Articles', href: '/admin/learn', icon: BookOpen },
  { name: 'Guides', href: '/admin/guides', icon: BookOpen },
  { name: 'Beans', href: '/admin/beans', icon: Coffee },
  { name: 'Roasters', href: '/admin/roasters', icon: Store },
  { name: 'Comparisons', href: '/admin/comparisons', icon: ArrowRightLeft },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminSidebar() {
  return (
    <div className="flex h-full w-64 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 shrink-0 items-center px-6">
        <Link href="/admin" className="text-xl font-bold tracking-tighter text-amber-900">
          CFN Admin
        </Link>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto pt-4">
        <nav className="flex-1 space-y-1 px-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <item.icon
                className="mr-3 h-5 w-5 shrink-0 text-gray-400 group-hover:text-gray-500"
                aria-hidden="true"
              />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-gray-200 p-4">
        <form action={logout}>
          <button
            type="submit"
            className="group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
            Logout
          </button>
        </form>
      </div>
    </div>
  )
}
