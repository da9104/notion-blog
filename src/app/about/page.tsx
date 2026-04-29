'use client'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

const AboutPage = () => {
    const { toast } = useToast()
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const name = formData.get("name");
        const email = formData.get("email");
        const message = formData.get("message");

        try {
            setIsLoading(true);
            const res = await fetch("/api/send_mail", {
                method: "POST",
                body: JSON.stringify({ name, email, message }),
            });
            await res.json();

            if (res.ok) {
                toast({
                    variant: "default",
                    title: t.about.successTitle,
                    description: t.about.successDesc,
                    duration: 2000,
                });
                event.currentTarget.reset();
            }
        } catch {
            toast({
                variant: "destructive",
                title: t.about.errorTitle,
                description: t.about.errorDesc,
                duration: 2000,
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div
            className="px-[var(--sides)] pt-[var(--top-spacing)] pb-28"
            style={{ fontFamily: 'var(--font-body)' }}
        >
            {/* About section */}
            <section className="mb-16">
                <p
                    className="text-[10px] font-semibold uppercase tracking-widest text-[var(--tertiary)] mb-4"
                    style={{ fontFamily: 'var(--font-body)' }}
                >
                    {t.about.label}
                </p>
                <h1
                    className="text-5xl font-medium leading-[1.1] tracking-tight text-[var(--foreground)] mb-6"
                    style={{ fontFamily: 'var(--font-headline)' }}
                >
                    DAMI K
                </h1>
                <div
                    className="flex flex-col gap-3 text-base leading-relaxed text-[var(--tertiary)]"
                    style={{ fontFamily: 'var(--font-body)' }}
                >
                    {t.about.bio.map((line, i) => <p key={i}>{line}</p>)}
                </div>
                <div className="mt-8">
                    <a
                        href="/cv_ko.html"
                        className="text-[10px] font-semibold uppercase tracking-widest text-[var(--foreground)] border-b border-[var(--foreground)] pb-0.5 hover:opacity-60 transition-opacity"
                        style={{ fontFamily: 'var(--font-body)' }}
                    >
                        {t.about.cvLink}
                    </a>
                </div>
            </section>

            {/* Divider */}
            <div className="border-t border-[var(--outline-variant)] mb-16" />

            {/* Contact form */}
            <section id="contact">
                <p
                    className="text-[10px] font-semibold uppercase tracking-widest text-[var(--tertiary)] mb-4"
                    style={{ fontFamily: 'var(--font-body)' }}
                >
                    {t.about.contactLabel}
                </p>
                <h2
                    className="text-3xl font-medium leading-[1.2] text-[var(--foreground)] mb-3"
                    style={{ fontFamily: 'var(--font-headline)' }}
                >
                    {t.about.contactHeading}
                </h2>
                <p
                    className="text-base leading-relaxed text-[var(--tertiary)] mb-10"
                    style={{ fontFamily: 'var(--font-body)' }}
                >
                    {t.about.contactDesc}
                </p>

                <form id="contact-form" onSubmit={handleSubmit} className="flex flex-col gap-8">
                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor="name"
                            className="text-[10px] font-semibold uppercase tracking-widest text-[var(--tertiary)]"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            {t.about.nameLabel}
                        </label>
                        <Input
                            id="name"
                            type="text"
                            name="name"
                            placeholder={t.about.namePlaceholder}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor="email"
                            className="text-[10px] font-semibold uppercase tracking-widest text-[var(--tertiary)]"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            {t.about.emailLabel}
                        </label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            placeholder={t.about.emailPlaceholder}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor="message"
                            className="text-[10px] font-semibold uppercase tracking-widest text-[var(--tertiary)]"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            {t.about.messageLabel}
                        </label>
                        <Textarea
                            id="message"
                            name="message"
                            placeholder={t.about.messagePlaceholder}
                            rows={4}
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 h-auto text-xs dark:text-black text-white"
                        style={{ fontFamily: 'var(--font-body)' }}
                    >
                        {isLoading ? t.about.sendingButton : t.about.sendButton}
                    </Button>
                </form>
            </section>
        </div>
    )
}

export default AboutPage;
