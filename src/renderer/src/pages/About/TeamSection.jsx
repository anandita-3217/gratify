import VelocityCarousel from './VelocityCarousel'
import Dev1 from '../../assets/dev_2.png'
import Test1 from '../../assets/dev_svg.svg'
import AboutCard from './AboutCard'

const teamMembers = [
  {
    thumbnail: {Dev1},
    name: 'Alice Kim',
    position: 'Lead Designer',
    nickname: 'Pixel Witch',
    description: 'Alice has 8 years of experience crafting digital products...',
    socials: [
      { label: 'LinkedIn', url: 'https://linkedin.com/in/alice' },
      { label: 'Dribbble', url: 'https://dribbble.com/alice' }
    ]
  },
  {
    thumbnail: {Test1},
    name: 'Ben Torres',
    position: 'Frontend Engineer',
    nickname: 'CSS Whisperer',
    description: 'Ben obsesses over smooth animations and clean component APIs...',
    socials: [
      { label: 'GitHub', url: 'https://github.com/ben' },
      { label: 'Twitter', url: 'https://twitter.com/ben' }
    ]
  }
  // add as many as you need...
]

export default function TeamSection() {
  return <VelocityCarousel cards={teamMembers} CardComponent={AboutCard} />
}
