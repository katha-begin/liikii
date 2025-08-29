import { LayoutPlanningTemplate } from '@/types/designSystem'

// Sample layout planning templates for the design system
export const LAYOUT_TEMPLATES: LayoutPlanningTemplate[] = [
  {
    id: 'project-dashboard',
    name: 'Project Dashboard Layout',
    category: 'page-layout',
    description: 'Standard project dashboard with navigation, metrics, and task overview',
    structure: {
      pageMetadata: {
        title: 'Project Dashboard',
        description: 'Overview page for project management with key metrics and task status',
        userTypes: ['Project Manager', 'VFX Supervisor', 'Producer'],
        primaryGoals: [
          'Monitor project progress',
          'Track task completion',
          'Identify bottlenecks',
          'Review team performance'
        ],
        businessGoals: [
          'Increase project visibility',
          'Improve delivery timelines',
          'Optimize resource allocation'
        ]
      },
      layoutPlanning: {
        wireframe: {
          regions: [
            {
              name: 'header',
              purpose: 'Navigation and project context',
              priority: 'primary',
              components: ['Breadcrumbs', 'ProjectSwitcher', 'UserAvatar'],
              constraints: ['Fixed height', 'Full width', 'Always visible']
            },
            {
              name: 'metrics',
              purpose: 'Key project metrics and progress indicators',
              priority: 'primary',
              components: ['Progress', 'Card', 'Icon'],
              constraints: ['Responsive grid', 'Equal height cards']
            },
            {
              name: 'navigation',
              purpose: 'Section navigation and filters',
              priority: 'secondary',
              components: ['Tabs', 'Dropdown', 'Button'],
              constraints: ['Sticky positioning', 'Horizontal scroll on mobile']
            },
            {
              name: 'content',
              purpose: 'Main content area with task lists and details',
              priority: 'primary',
              components: ['Table', 'List', 'Card', 'Avatar', 'Badge'],
              constraints: ['Scrollable', 'Flexible height', 'Responsive columns']
            }
          ],
          hierarchy: ['header', 'metrics', 'navigation', 'content'],
          contentFlow: [
            'User enters page → sees project context in header',
            'User reviews metrics → understands project status',
            'User navigates sections → filters content',
            'User interacts with tasks → manages work'
          ]
        },
        responsive: {
          breakpoints: [
            {
              name: 'mobile',
              minWidth: 0,
              maxWidth: 767,
              adaptations: [
                'Stack metrics vertically',
                'Convert tabs to dropdown',
                'Hide secondary columns in tables',
                'Increase touch targets'
              ]
            },
            {
              name: 'tablet',
              minWidth: 768,
              maxWidth: 1023,
              adaptations: [
                'Two-column metrics layout',
                'Horizontal tabs with scroll',
                'Condensed table view',
                'Side navigation drawer'
              ]
            },
            {
              name: 'desktop',
              minWidth: 1024,
              adaptations: [
                'Full metrics grid',
                'All navigation visible',
                'Complete table columns',
                'Fixed sidebar navigation'
              ]
            }
          ],
          adaptations: [
            {
              breakpoint: 'mobile',
              changes: [
                {
                  component: 'Tabs',
                  property: 'variant',
                  value: 'pills'
                },
                {
                  component: 'Card',
                  property: 'padding',
                  value: 'sm'
                }
              ]
            }
          ]
        },
        components: {
          required: [
            {
              component: 'Breadcrumbs',
              variant: 'default',
              purpose: 'Show navigation hierarchy',
              alternatives: ['Simple text path']
            },
            {
              component: 'Progress',
              variant: 'default',
              purpose: 'Display project completion',
              alternatives: ['Percentage text', 'Status badge']
            },
            {
              component: 'Tabs',
              variant: 'underline',
              purpose: 'Section navigation',
              alternatives: ['Dropdown menu', 'Button group']
            }
          ],
          optional: [
            {
              component: 'Tooltip',
              variant: 'default',
              purpose: 'Additional context for metrics',
              alternatives: ['Modal dialogs', 'Expandable cards']
            },
            {
              component: 'Avatar',
              variant: 'circle',
              purpose: 'Show team member assignments',
              alternatives: ['Text initials', 'User icons']
            }
          ],
          custom: [
            {
              name: 'ProjectMetricsCard',
              purpose: 'Specialized card for project KPIs',
              baseComponent: 'Card',
              customizations: [
                'Icon integration',
                'Progress visualization',
                'Trend indicators'
              ],
              designTokens: [
                '--metrics-card-bg',
                '--metrics-icon-color',
                '--metrics-trend-positive',
                '--metrics-trend-negative'
              ]
            }
          ]
        }
      },
      designSystem: {
        colorScheme: [
          'var(--accent-blue)', // Primary actions
          'var(--semantic-success)', // Completed items
          'var(--semantic-warning)', // In progress items
          'var(--semantic-danger)' // Blocked/overdue items
        ],
        typography: [
          {
            element: 'h1',
            fontSize: 'var(--text-h1)',
            lineHeight: 'var(--text-h1-lh)',
            fontWeight: '600',
            usage: ['Page title', 'Project name']
          },
          {
            element: 'h2',
            fontSize: 'var(--text-h2)',
            lineHeight: 'var(--text-h2-lh)',
            fontWeight: '600',
            usage: ['Section headers', 'Card titles']
          }
        ],
        spacing: [
          {
            name: 'section-gap',
            value: 'var(--space-6)',
            usage: ['Between major sections']
          },
          {
            name: 'card-gap',
            value: 'var(--space-4)',
            usage: ['Between cards in grid']
          }
        ],
        patterns: [
          {
            name: 'hover-lift',
            description: 'Cards lift slightly on hover',
            components: ['Card', 'Button'],
            states: ['hover'],
            transitions: ['transform 0.2s ease', 'box-shadow 0.2s ease']
          }
        ]
      }
    },
    presets: [
      {
        name: 'VFX Production Dashboard',
        description: 'Optimized for VFX production workflows',
        components: [
          {
            component: 'Progress',
            props: { variant: 'success', showLabel: true },
            layout: { x: 0, y: 0, width: 4, height: 2 }
          },
          {
            component: 'Tabs',
            props: { variant: 'underline', items: ['Shots', 'Assets', 'Reviews'] },
            layout: { x: 0, y: 2, width: 12, height: 1 }
          }
        ],
        responsive: {
          mobile: [
            {
              component: 'Tabs',
              props: { variant: 'pills' },
              layout: { x: 0, y: 2, width: 12, height: 2 }
            }
          ],
          tablet: [],
          desktop: []
        }
      }
    ],
    validation: [
      {
        id: 'required-navigation',
        description: 'Page must have navigation breadcrumbs',
        validator: (structure) => {
          return structure.layoutPlanning.components.required.some(
            comp => comp.component === 'Breadcrumbs'
          )
        },
        errorMessage: 'Navigation breadcrumbs are required for this layout'
      },
      {
        id: 'responsive-breakpoints',
        description: 'Must define mobile, tablet, and desktop breakpoints',
        validator: (structure) => {
          const breakpoints = structure.layoutPlanning.responsive.breakpoints
          return ['mobile', 'tablet', 'desktop'].every(bp =>
            breakpoints.some(b => b.name === bp)
          )
        },
        errorMessage: 'All responsive breakpoints (mobile, tablet, desktop) must be defined'
      }
    ]
  }
]

export default LAYOUT_TEMPLATES
