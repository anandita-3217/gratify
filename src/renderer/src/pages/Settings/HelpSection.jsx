import { Stack, Text, Accordion, Anchor, Divider, Group } from '@mantine/core'

const FAQS = [
  {
    q: 'How do I create a recurring task?',
    a: 'When adding a task, check the Recurring checkbox and select a frequency.'
  },
  {
    q: 'How do I link a task to a calendar event?',
    a: 'When creating a task with a deadline, check Add to Calendar to automatically create an event.'
  },
  {
    q: 'How do I create a custom timer technique?',
    a: 'In the Timer page, switch to Focus mode and click the + button next to the technique picker.'
  },
  {
    q: 'How do I export my data?',
    a: 'Go to Settings → Data → Export to download all your data as a JSON file.'
  }
]

export default function HelpSection() {
  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Text fw={600}>Frequently Asked Questions</Text>
        <Accordion variant="separated" radius="md">
          {FAQS.map((faq, i) => (
            <Accordion.Item key={i} value={String(i)}>
              <Accordion.Control>{faq.q}</Accordion.Control>
              <Accordion.Panel>
                <Text size="sm" c="dimmed">
                  {faq.a}
                </Text>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </Stack>

      <Divider />

      <Stack gap="xs">
        <Text fw={600}>About</Text>
        <Text size="sm" c="dimmed">
          Gratify v1.0.0
        </Text>
        <Text size="sm" c="dimmed">
          Built with Electron, React and Mantine
        </Text>
        {/* <Anchor size="sm" href="mailto:you@email.com">Report a bug</Anchor> */}
      </Stack>
    </Stack>
  )
}
