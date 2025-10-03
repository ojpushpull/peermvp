# UI Components Guide

A collection of reusable UI components to help you build pages quickly without AI assistance.

## Quick Start

Import components from `@/components/ui`:

```tsx
import { Button, Card, Heading, Section } from '@/components/ui'
```

---

## Components

### 1. Button

A versatile button component with multiple variants and sizes.

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'danger' | 'success' (default: 'primary')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `href`: Optional link URL (renders as Next.js Link)
- `fullWidth`: Boolean (default: false)
- `disabled`: Boolean (default: false)
- `onClick`: Function handler
- `type`: 'button' | 'submit' | 'reset' (default: 'button')

**Examples:**
```tsx
// Primary button
<Button>Click Me</Button>

// Link button
<Button href="/jobs" variant="primary">View Jobs</Button>

// Outlined button
<Button variant="outline" size="lg">Learn More</Button>

// Danger button
<Button variant="danger" onClick={handleDelete}>Delete</Button>

// Full width button
<Button fullWidth>Submit Form</Button>
```

---

### 2. Card

A container with border, shadow, and padding.

**Props:**
- `padding`: 'none' | 'sm' | 'md' | 'lg' (default: 'md')
- `hover`: Boolean - adds hover effect (default: false)

**Examples:**
```tsx
<Card>
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>

<Card padding="lg" hover>
  <h3>Hoverable Card</h3>
</Card>
```

---

### 3. Container

Centers content with responsive padding.

**Props:**
- `size`: 'sm' | 'md' | 'lg' | 'xl' | 'full' (default: 'lg')

**Examples:**
```tsx
<Container>
  <p>Centered content with max-width</p>
</Container>

<Container size="sm">
  <p>Smaller container</p>
</Container>
```

---

### 4. Section

A full-width section with Container inside.

**Props:**
- `background`: 'white' | 'gray' | 'blue' | 'none' (default: 'white')
- `padding`: 'none' | 'sm' | 'md' | 'lg' | 'xl' (default: 'lg')
- `containerSize`: 'sm' | 'md' | 'lg' | 'xl' | 'full' (default: 'lg')

**Examples:**
```tsx
<Section background="gray" padding="xl">
  <h2>Section Title</h2>
  <p>Section content</p>
</Section>

<Section background="blue" containerSize="md">
  <p>Blue background section</p>
</Section>
```

---

### 5. Heading

Responsive heading component.

**Props:**
- `level`: 1 | 2 | 3 | 4 | 5 | 6 (default: 2)
- `align`: 'left' | 'center' | 'right' (default: 'left')

**Examples:**
```tsx
<Heading level={1}>Page Title</Heading>

<Heading level={2} align="center">
  Centered Subtitle
</Heading>

<Heading level={3}>Section Heading</Heading>
```

---

### 6. Badge

Small label for status or categories.

**Props:**
- `variant`: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray' | 'orange' (default: 'blue')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')

**Examples:**
```tsx
<Badge variant="green">Active</Badge>
<Badge variant="red" size="sm">New</Badge>
<Badge variant="blue">Full-time</Badge>
```

---

### 7. Grid

Responsive grid layout.

**Props:**
- `cols`: 1 | 2 | 3 | 4 | 5 | 6 (default: 3)
- `gap`: 'sm' | 'md' | 'lg' | 'xl' (default: 'md')

**Examples:**
```tsx
<Grid cols={3} gap="lg">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</Grid>

<Grid cols={2}>
  <div>Column 1</div>
  <div>Column 2</div>
</Grid>
```

---

### 8. Input

Form input with label and error states.

**Props:**
- `label`: String (optional)
- `error`: String (optional)
- `helperText`: String (optional)
- `fullWidth`: Boolean (default: true)
- All standard HTML input props

**Examples:**
```tsx
<Input
  label="Email"
  type="email"
  placeholder="you@example.com"
/>

<Input
  label="Password"
  type="password"
  error="Password is required"
/>

<Input
  label="Name"
  helperText="Enter your full name"
/>
```

---

### 9. Alert

Notification/message box with variants.

**Props:**
- `variant`: 'info' | 'success' | 'warning' | 'error' (default: 'info')

**Examples:**
```tsx
<Alert variant="success">
  Your changes have been saved!
</Alert>

<Alert variant="error">
  Something went wrong. Please try again.
</Alert>

<Alert variant="warning">
  This action cannot be undone.
</Alert>
```

---

### 10. Spinner

Loading spinner.

**Props:**
- `size`: 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
- `color`: 'blue' | 'white' | 'gray' (default: 'blue')

**Examples:**
```tsx
<Spinner />
<Spinner size="lg" color="white" />
```

---

## Full Page Example

Here's how to build a complete page using these components:

```tsx
import {
  Section,
  Container,
  Heading,
  Card,
  Grid,
  Button,
  Badge,
  Alert
} from '@/components/ui'

export default function ExamplePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Section background="blue" padding="xl">
        <Heading level={1} align="center">
          Welcome to Our Platform
        </Heading>
        <p className="text-center text-blue-100 mt-4 text-lg">
          Build amazing things with our reusable components
        </p>
        <div className="flex justify-center gap-4 mt-8">
          <Button href="/get-started" size="lg">
            Get Started
          </Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </Section>

      {/* Features Section */}
      <Section background="white" padding="xl">
        <Heading level={2} align="center">
          Our Features
        </Heading>

        <Grid cols={3} gap="lg" className="mt-12">
          <Card padding="lg" hover>
            <Badge variant="blue">New</Badge>
            <h3 className="text-xl font-bold mt-4 mb-2">Feature One</h3>
            <p className="text-gray-600">
              Description of your first feature
            </p>
          </Card>

          <Card padding="lg" hover>
            <Badge variant="green">Popular</Badge>
            <h3 className="text-xl font-bold mt-4 mb-2">Feature Two</h3>
            <p className="text-gray-600">
              Description of your second feature
            </p>
          </Card>

          <Card padding="lg" hover>
            <Badge variant="purple">Pro</Badge>
            <h3 className="text-xl font-bold mt-4 mb-2">Feature Three</h3>
            <p className="text-gray-600">
              Description of your third feature
            </p>
          </Card>
        </Grid>
      </Section>

      {/* CTA Section */}
      <Section background="gray">
        <Alert variant="info">
          <strong>Pro tip:</strong> You can combine these components in countless ways!
        </Alert>

        <Card className="mt-8" padding="lg">
          <Heading level={3}>Ready to get started?</Heading>
          <p className="text-gray-600 mt-2 mb-6">
            Join thousands of users already using our platform
          </p>
          <Button fullWidth>Sign Up Now</Button>
        </Card>
      </Section>
    </div>
  )
}
```

---

## Tips

1. **Combine components**: Nest components inside each other for complex layouts
2. **Custom styling**: Add `className` prop to any component for additional Tailwind classes
3. **Consistency**: Use the same variant/size across similar elements
4. **Responsive**: Components are mobile-first and responsive by default
5. **Import once**: Import all components at the top of your file

---

## Common Patterns

### Two-column layout
```tsx
<Section>
  <Grid cols={2}>
    <div>Left content</div>
    <div>Right content</div>
  </Grid>
</Section>
```

### Feature grid
```tsx
<Grid cols={3} gap="lg">
  {features.map(feature => (
    <Card key={feature.id} hover>
      <Badge>{feature.tag}</Badge>
      <h3>{feature.title}</h3>
      <p>{feature.description}</p>
    </Card>
  ))}
</Grid>
```

### Form section
```tsx
<Section background="white">
  <Card>
    <Heading level={2}>Contact Us</Heading>
    <Input label="Name" placeholder="Your name" />
    <Input label="Email" type="email" />
    <Button fullWidth>Submit</Button>
  </Card>
</Section>
```

---

Happy building! 🚀
