import { notifications } from '@mantine/notifications'
//TODO: Change color of mantine notifications
export const notify = {
  error: (title, message) =>
    notifications.show({
      title,
      message,
      color: 'red',
      autoClose: 4000
    }),
  success: (title, message) =>
    notifications.show({
      title,
      message,
      color: 'green',
      autoClose: 4000
    }),
  warning: (title, message) =>
    notifications.show({
      title,
      message,
      color: 'orange',
      autoClose: 4000
    }),
  info: (title, message) =>
    notifications.show({
      title,
      message,
      color: 'cyan',
      autoClose: 4000
    })
}
