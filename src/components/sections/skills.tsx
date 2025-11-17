import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimateOnScroll } from '@/components/animate-on-scroll';
import { SkillIcons } from '@/components/icons/skill-icons';

const skillCategories = [
  {
    title: 'Frontend',
    skills: [
      { name: 'HTML5', icon: <SkillIcons.HTML5 className="h-8 w-8 object-contain" /> },
      { name: 'CSS3', icon: <SkillIcons.CSS3 className="h-8 w-8 object-contain" /> },
      { name: 'JavaScript', icon: <SkillIcons.JavaScript className="h-8 w-8 object-contain" /> },
      { name: 'React', icon: <SkillIcons.React className="h-8 w-8" /> },
      { name: 'Vue.js', icon: <SkillIcons.VueJS className="h-8 w-8 object-contain" /> },
      { name: 'Next.js', icon: <SkillIcons.NextJS className="h-8 w-8 object-contain" /> },
    ],
  },
  {
    title: 'Backend',
    skills: [
      { name: 'Node.js', icon: <SkillIcons.NodeJS className="h-8 w-8 object-contain" /> },
      { name: 'Python', icon: <SkillIcons.Python className="h-8 w-8 object-contain" /> },
      { name: 'PHP', icon: <SkillIcons.PHP className="h-8 w-8 object-contain" /> },
      { name: 'SQL', icon: <SkillIcons.SQL className="h-8 w-8 object-contain" /> },
    ],
  },
  {
    title: 'Tools & Others',
    skills: [
      { name: 'Git', icon: <SkillIcons.Git className="h-8 w-8 object-contain" /> },
      { name: 'Webpack', icon: <SkillIcons.Webpack className="h-8 w-8 object-contain" /> },
      { name: 'Figma', icon: <SkillIcons.Figma className="h-8 w-8 object-contain" /> },
      { name: 'Adobe XD', icon: <SkillIcons.AdobeXD className="h-8 w-8 object-contain" /> },
      { name: 'REST APIs', icon: <SkillIcons.RestAPI className="h-8 w-8 object-contain" /> },
      { name: 'WordPress', icon: <SkillIcons.WordPress className="h-8 w-8 object-contain" /> },
      { name: 'Supabase', icon: <SkillIcons.Supabase className="h-8 w-8 object-contain" /> },
      { name: 'Firebase', icon: <SkillIcons.Firebase className="h-8 w-8 object-contain" /> },
    ],
  },
  {
    title: 'Data Analysis',
    skills: [
        { name: 'Python', icon: <SkillIcons.Python className="h-8 w-8 object-contain" /> },
        { name: 'R', icon: <SkillIcons.R className="h-8 w-8 object-contain" /> },
        { name: 'Stata', icon: <SkillIcons.Stata className="h-8 w-8 object-contain" /> },
        { name: 'Spss', icon: <SkillIcons.Spss className="h-8 w-8 object-contain" /> },
        { name: 'EViews', icon: <SkillIcons.EViews className="h-8 w-8 object-contain" /> },
    ],
  },
];

export function Skills() {
  return (
    <section id="skills" className="w-full py-20 lg:py-32">
      <AnimateOnScroll className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tighter text-primary sm:text-4xl md:text-5xl">
            My Skills
          </h2>
          <p className="mx-auto mt-4 max-w-[700px] text-foreground/80 md:text-xl">
            Technologies I'm proficient with and use in my projects.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {skillCategories.map((category, index) => (
            <AnimateOnScroll key={category.title} delay={index * 100}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-center text-xl text-primary/90">{category.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {category.skills.map(skill => (
                      <div key={skill.name} className="flex flex-col items-center justify-center space-y-2 rounded-lg bg-background p-4 transition-transform hover:scale-105 hover:bg-accent">
                        {skill.icon}
                        <span className="text-sm font-medium text-foreground/80">{skill.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </AnimateOnScroll>
          ))}
        </div>
      </AnimateOnScroll>
    </section>
  );
}
