'use client'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

const AboutPage = () => {

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const name = formData.get("name");
        const email = formData.get("email");
        const message = formData.get("message");

        const res = await fetch("/api/send_mail", {
            method: "POST",
            body: JSON.stringify({ name, email, message }),
        });
        const data = await res.json();
        console.log(data);
    }

    return (
        <div className="max-w-screen-md mx-auto py-10">
            <div className="flex flex-col gap-1 pb-10">
                <h1 className="text-2xl font-bold pb-6">DAMI K</h1>
                <p>I'm a software engineer with a passion for building beautiful and functional web applications.</p>
                <p>currently, working as a front end developer at a startup in S.Korea.</p>
                <p>Dami UI is a design system for Front End Solution.</p>
                <p>It is a collection of articles, tutorials, and design system resources for Front End Solution.</p>
                <p>This website is powered by Notion as a CMS and Next.js.</p>
                <p>I hope You will find a gist featuring Tailwind CSS, React with TypeScript, Framer Motion, GSAP animations, and more.</p>
                <p>If you have any questions, please contact me here,</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-screen-sm">
                <Input type="text" name="name" placeholder="Name" />
                <Input type="email" name="email" placeholder="Email" />
                <Textarea name="message" placeholder="Message" />
                <Button type="submit">Send</Button>
            </form>
        </div>
    )
}

export default AboutPage;