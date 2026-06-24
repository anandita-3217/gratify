// import { Card } from "@mantine/core";

// export default function AboutCard(){
//     return (
//         <Card bg='red'></Card>
//     )
// }
import { useState } from 'react'
import {
  Card,
  Image,
  Text,
  Badge,
  Group,
  Stack,
  Divider,
  Anchor,
  Box,
  Transition,
  ActionIcon
} from '@mantine/core'
import { IconArrowUpRight } from '@tabler/icons-react'
import PropTypes from 'prop-types'

export default function Options({
  title,
  category,
  thumbnail,
  overview,
  tools,
  clientName,
  projectDuration,
  projectLink,
  projectDescription
}) {
  const [hovered, setHovered] = useState(false)

  const toolList = Array.isArray(tools)
    ? tools
    : (tools ?? '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

  return (
    <Card
      radius="xl"
      padding={0}
      withBorder
      style={{
        overflow: 'hidden',
        maxWidth: 420,
        cursor: 'default',
        transition: 'box-shadow 220ms ease, transform 220ms ease',
        boxShadow: hovered ? '0 20px 60px rgba(0,0,0,0.12)' : '0 2px 12px rgba(0,0,0,0.06)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)'
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Thumbnail ── */}
      <Box style={{ position: 'relative', overflow: 'hidden' }}>
        <Image
          src={thumbnail}
          alt={title}
          height={240}
          style={{
            transition: 'transform 400ms ease',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
            display: 'block'
          }}
        />

        {/* Category badge overlaid on image */}
        <Badge
          size="sm"
          radius="md"
          variant="filled"
          color="dark"
          style={{
            position: 'absolute',
            top: 14,
            left: 14,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            fontSize: 10,
            fontWeight: 700,
            backdropFilter: 'blur(8px)',
            background: 'rgba(0,0,0,0.65)'
          }}
        >
          {category}
        </Badge>

        {/* Link button overlaid on image */}
        {projectLink && (
          <Transition mounted={hovered} transition="fade" duration={180}>
            {(styles) => (
              <ActionIcon
                component="a"
                href={projectLink}
                target="_blank"
                rel="noopener noreferrer"
                variant="white"
                radius="xl"
                size="lg"
                style={{
                  ...styles,
                  position: 'absolute',
                  top: 14,
                  right: 14
                }}
                aria-label="Open project"
              >
                <IconArrowUpRight size={18} />
              </ActionIcon>
            )}
          </Transition>
        )}
      </Box>

      {/* ── Body ── */}
      <Stack gap="md" p="xl">
        {/* Title + overview */}
        <Stack gap={6}>
          <Text fw={700} size="lg" lh={1.3}>
            {title}
          </Text>
          <Text size="sm" c="dimmed" lh={1.6}>
            {overview}
          </Text>
        </Stack>

        {projectDescription && (
          <Text size="sm" c="dimmed" lh={1.6}>
            {projectDescription}
          </Text>
        )}

        <Divider />

        {/* Metadata grid */}
        <Group justify="space-between" align="flex-start" gap="xs">
          <MetaField label="Client" value={clientName} />
          <MetaField label="Duration" value={projectDuration} />
        </Group>

        {/* Tools */}
        <Stack gap={4}>
          <Text size="xs" tt="uppercase" fw={600} c="dimmed" lh={1}>
            Tools Used
          </Text>
          <Group gap={6} wrap="wrap">
            {toolList.map((tool) => (
              <Badge key={tool} size="sm" radius="sm" variant="light" color="gray">
                {tool}
              </Badge>
            ))}
          </Group>
        </Stack>

        {/* CTA link */}
        {projectLink && (
          <Anchor
            href={projectLink}
            target="_blank"
            rel="noopener noreferrer"
            size="sm"
            fw={600}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
          >
            View Project <IconArrowUpRight size={14} />
          </Anchor>
        )}
      </Stack>
    </Card>
  )
}
Options.propTypes = {
  title: PropTypes.string,
  category: PropTypes.string,
  thumbnail: PropTypes.string,
  overview: PropTypes.string,
  tools: PropTypes.arrayOf(PropTypes.string),
  clientName: PropTypes.string,
  projectDuration: PropTypes.string,
  projectLink: PropTypes.string,
  projectDescription: PropTypes.string
}

/** Small two-line label + value block */
function MetaField({ label, value }) {
  return (
    <Stack gap={2}>
      <Text size="xs" tt="uppercase" fw={600} c="dimmed" lh={1}>
        {label}
      </Text>
      <Text size="sm" fw={500}>
        {value}
      </Text>
    </Stack>
  )
}

MetaField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string
}
