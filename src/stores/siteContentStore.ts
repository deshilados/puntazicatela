import { defineStore } from 'pinia';
import { supabase } from '@/utils/supabase';

type FlatContent = Record<string, string | null>;

export const useSiteContentStore = defineStore('siteContent', {
  state: () => ({
    items: {} as FlatContent,
    loading: false,
    error: null as string | null
  }),
  actions: {
    async fetchAll() {
      this.loading = true;
      this.error = null;
      const { data, error } = await supabase.from('site_content').select('key, value');
      if (error) {
        this.error = error.message;
        this.items = {};
      } else {
        const map: FlatContent = {};
        (data ?? []).forEach((r: { key: string; value: string | null }) => {
          map[r.key] = r.value;
        });
        this.items = map;
      }
      this.loading = false;
    },
    get(key: string, fallback = ''): string {
      const v = this.items[key];
      return (v ?? fallback) as string;
    },
    async set(key: string, value: string) {
      const { error } = await supabase
        .from('site_content')
        .upsert({ key, value }, { onConflict: 'key' });
      if (error) throw new Error(error.message);
      this.items[key] = value;
    },
    async setBulk(entries: Record<string, string>) {
      const rows = Object.entries(entries).map(([key, value]) => ({ key, value }));
      const { error } = await supabase.from('site_content').upsert(rows, { onConflict: 'key' });
      if (error) throw new Error(error.message);
      Object.assign(this.items, entries);
    },
    /** Nested keys like PHP getContent: navbar.brand, footer.contact.phone */
    getNested(dotKey: string, fallback = ''): string {
      const keys = dotKey.split('.');
      let v: unknown = this.items;
      for (const k of keys) {
        if (v && typeof v === 'object' && k in (v as object)) {
          v = (v as Record<string, unknown>)[k];
        } else {
          return fallback;
        }
      }
      return typeof v === 'string' ? v : fallback;
    },
    /** Build nested structure for views (navbar, footer, meta, home) */
    getNestedStructured() {
      const g = (key: string) => this.items[key] ?? '';
      return {
        navbar: { brand: g('navbar_brand'), logo: g('navbar_logo') },
        footer: {
          brand: g('footer_brand'),
          description: g('footer_description'),
          contact: {
            title: g('footer_contact_title'),
            address: { street: g('footer_contact_street'), city: g('footer_contact_city') },
            phone: g('footer_contact_phone'),
            email: g('footer_contact_email')
          },
          schedule: {
            title: g('footer_schedule_title'),
            weekdays: { days: g('footer_schedule_days'), hours: g('footer_schedule_hours') },
            extra: { days: g('footer_schedule_days_2'), hours: g('footer_schedule_hours_2') }
          },
          social: {
            facebook: g('footer_social_facebook'),
            instagram: g('footer_social_instagram'),
            whatsapp: g('footer_social_whatsapp')
          },
          copyright: { text: g('footer_copyright_text'), made_with: g('footer_copyright_made_with') }
        },
        meta: {
          site: {
            name: g('meta_site_name'),
            icon: g('meta_site_icon'),
            description: g('meta_site_description'),
            location: g('meta_site_location')
          }
        },
        home: {
          hero: {
            location: g('home_hero_location'),
            title: g('home_hero_title'),
            description: g('home_hero_description'),
            image: g('home_hero_image')
          },
          collection: {
            title: g('home_collection_title'),
            description: g('home_collection_description'),
            no_products: g('home_collection_no_products')
          },
          about: {
            badge: g('home_about_badge'),
            title: g('home_about_title'),
            description1: g('home_about_description1'),
            description2: g('home_about_description2'),
            image: g('home_about_image'),
            stats: {
              years: { value: g('home_about_stats_years_value'), label: g('home_about_stats_years_label') },
              countrys: { value: g('home_about_stats_countrys_value'), label: g('home_about_stats_countrys_label') },
              products: { value: g('home_about_stats_products_value'), label: g('home_about_stats_products_label') }
            }
          }
        }
      };
    }
  }
});

export function whatsappUrlToNumber(url: string): string {
  if (!url || typeof url !== 'string') return '';
  const m = url.match(/wa\.me\/([0-9]+)/);
  return m ? m[1] : url;
}

export function numberToWhatsAppUrl(number: string): string {
  const n = (number || '').replace(/\D/g, '');
  if (!n) return '';
  return `https://wa.me/${n}?text=Hola,%20me%20interesa%20información%20sobre%20sus%20productos`;
}
