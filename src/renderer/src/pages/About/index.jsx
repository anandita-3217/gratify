import { Box, Paper, Text, useMantineTheme } from '@mantine/core'

export default function About() {
  const theme = useMantineTheme()
  return (
    <Paper>
      <Box>
        <Text color={theme.primaryColor}>I am the dev</Text>
      </Box>
    </Paper>
  )
}
