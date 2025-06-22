"use client"

import { useRef, useState, useEffect } from "react"
import gsap from "gsap"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { NotionRenderer } from "./NotionRenderer"
import { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import { notion } from "@/lib/notion"
import Autoplay from "embla-carousel-autoplay"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "./ui/carousel"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "./ui/skeleton"


const scaleAnimation = {
    initial: { scale: 0, x: "-50%", y: "-50%" },
    enter: { scale: 1, x: "-50%", y: "-50%", transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] } },
    closed: { scale: 0, x: "-50%", y: "-50%", transition: { duration: 0.4, ease: [0.32, 0, 0.67, 0] } }
}

export const slideLeft = {
    initial: {
        x: 0
    },
    animate: {
        x: "-100%",
        transition: {
            duration: 10,
            ease: "linear",
            repeat: Infinity
        }
    }
}


export default function Component() {
    const [currentPage, setCurrentPage] = useState<"home" | "about">("home")
    return (
        <div className="min-h-screen bg-gray-50">
            <AnimatePresence mode="wait">
                {currentPage === "home" ? (
                    <HomePage key="home" onNavigate={() => setCurrentPage("about")} />
                ) : (
                    <AboutPage key="about" onNavigate={() => setCurrentPage("home")} />
                )}
            </AnimatePresence>
        </div>
    )
}

function HomePage({ onNavigate }: { onNavigate: () => void }) {
    const [isLoading, setIsLoading] = useState(true)
    const [posts, setPosts] = useState<any[]>([])
    const [blocks, setBlocks] = useState<any[]>([])
    const [modal, setModal] = useState({ active: true, index: 0 })
    const { active, index } = modal;
    const modalContainer = useRef<HTMLDivElement>(null);
    const cursor = useRef<HTMLDivElement>(null);
    const cursorLabel = useRef<HTMLDivElement>(null);
    const heroImageContainer = useRef<HTMLDivElement>(null);
    const { toast } = useToast()

    let xMoveContainer = useRef<((value: number) => void) | null>(null);
    let yMoveContainer = useRef<((value: number) => void) | null>(null);
    let xMoveCursor = useRef<((value: number) => void) | null>(null);
    let yMoveCursor = useRef<((value: number) => void) | null>(null);
    let xMoveCursorLabel = useRef<((value: number) => void) | null>(null);
    let yMoveCursorLabel = useRef<((value: number) => void) | null>(null);

    useEffect(() => {
        //Move Container
        xMoveContainer.current = gsap.quickTo(modalContainer.current, "left", { duration: 0.8, ease: "power3" })
        yMoveContainer.current = gsap.quickTo(modalContainer.current, "top", { duration: 0.8, ease: "power3" })
        //Move cursor
        xMoveCursor.current = gsap.quickTo(cursor.current, "left", { duration: 0.5, ease: "power3" })
        yMoveCursor.current = gsap.quickTo(cursor.current, "top", { duration: 0.5, ease: "power3" })
        //Move cursor label
        xMoveCursorLabel.current = gsap.quickTo(cursorLabel.current, "left", { duration: 0.45, ease: "power3" })
        yMoveCursorLabel.current = gsap.quickTo(cursorLabel.current, "top", { duration: 0.45, ease: "power3" })
    }, [])

    const moveItems = (x: number, y: number) => {
        xMoveContainer.current?.(x)
        yMoveContainer.current?.(y)
        xMoveCursor.current?.(x)
        yMoveCursor.current?.(y)
        xMoveCursorLabel.current?.(x)
        yMoveCursorLabel.current?.(y)
    }
    const manageModal = (active: boolean, index: number, x: number, y: number) => {
        moveItems(x, y)
        setModal({ active, index })
    }

    useEffect(() => {
        if (heroImageContainer.current) {
            const bounds = heroImageContainer.current.getBoundingClientRect();
            if (bounds.top < 0) {
                gsap.set(heroImageContainer.current, { x: "-100%" })
                gsap.set(heroImageContainer.current, { x: "100%" })
            }
            else {
                gsap.set(heroImageContainer.current, { x: "100%" })
                gsap.set(heroImageContainer.current, { x: "-100%" })
            }
            gsap.to(heroImageContainer.current, { x: "0%", duration: 0.3 })
        }
    }, [])

    useEffect(() => {
        setIsLoading(true)
        const fetchPosts = async () => {
            try {
                const fetchUrl = '/api/get_post'  // Simplified URL
                console.log("Fetching from:", fetchUrl)
                const fetchedPosts = await fetch(fetchUrl)

                console.log("Response status:", fetchedPosts.status)
                console.log("Response ok:", fetchedPosts.ok)

                const data = await fetchedPosts.json()
                console.log("Response data:", data)

                if (!fetchedPosts.ok) {
                    throw new Error(`HTTP error! status: ${fetchedPosts.status}, message: ${JSON.stringify(data)}`)
                }

                setPosts(data.posts)
                setBlocks(data.blocks || [])

            } catch (error) {
                console.error("Error fetching posts:", error)
                // Add user-friendly error display
                toast({
                    title: "Error fetching posts",
                    description: `Error fetching posts: ${error}`,
                    variant: "destructive"
                })
            } finally {
                setIsLoading(false)
            }
        }
        fetchPosts()
    }, [])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex flex-col"
        >
            {/* Header */}
            <header className="p-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Dami Ui</h1>
            </header>

            {/* Main Content */}
            <motion.div
                ref={modalContainer}
                initial="initial"
                animate={active ? "enter" : "closed"}
                onMouseMove={(e) => { moveItems(e.clientX, e.clientY) }}
                className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-6">
                    <motion.div
                        onMouseEnter={() => setModal({ ...modal, active: true })}
                        onMouseLeave={() => setModal({ ...modal, active: false })}
                        layoutId="hero-image"
                        className="mx-auto md:w-screen w-full h-full overflow-hidden">
                        <Carousel
                            plugins={[
                                Autoplay({
                                    delay: 2000,
                                }),
                            ]}
                            className="md:w-screen w-full">
                            <CarouselContent className="flex flex-row gap-2">
                                {
                                    isLoading ? (
                                        <div className="flex flex-row gap-4 flex-shrink-0 w-[300px] h-[200px] bg-white p-4">
                                            <Skeleton className="w-full h-full" />
                                            <Skeleton className="w-full h-full" />
                                            <Skeleton className="w-full h-full" />
                                        </div>
                                    ) :
                                        posts.map((post) => {
                                            const titleProperty = post.properties.Title as { title: Array<{ plain_text: string }> }
                                            const title = titleProperty.title[0]?.plain_text || "Untitled"

                                            // Try to extract image URL from File property first (preferred method)
                                            const fileProperty = post.properties.File as unknown as {
                                                type: "file" | "files",
                                                file?: { url: string },
                                                files?: Array<{ type: "file" | "external", file?: { url: string }, external?: { url: string }, name: string }>
                                            } | undefined

                                            // Get URL from either file or files property format
                                            let imageUrl = fileProperty?.file?.url ||
                                                fileProperty?.files?.[0]?.file?.url ||
                                                fileProperty?.files?.[0]?.external?.url

                                            // If no File property image, try to find image from blocks (fallback)
                                            if (!imageUrl) {
                                                const imageBlock = blocks.find(
                                                    (block: any) => block.type === 'image' && block.postId === post.id
                                                );

                                                if (imageBlock) {
                                                    imageUrl = imageBlock.image.type === 'external'
                                                        ? imageBlock.image.external.url
                                                        : imageBlock.image.file.url;
                                                }
                                            }

                                            const slug = post.properties.Slug?.rich_text[0]?.plain_text || post.id

                                            return (
                                                <CarouselItem key={post.id} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/5">
                                                    <Link href={`/posts/${slug}`}>
                                                        <Card className="h-[200px] bg-white p-2 flex flex-col">
                                                            {imageUrl && (
                                                                <div className="w-full h-full relative bg-gray-100 flex items-center justify-center text-sm text-gray-500 rounded-md overflow-hidden">
                                                                    <Image
                                                                        src={imageUrl}
                                                                        alt={title}
                                                                        fill
                                                                        className="object-cover"
                                                                    />
                                                                </div>
                                                            )}
                                                            <h1 className="text-lg font-bold truncate p-2">{title}</h1>
                                                        </Card>
                                                    </Link>
                                                </CarouselItem>
                                            )
                                        }
                                        )
                                }
                                <CarouselItem className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/5">
                                    <Card onClick={onNavigate} className="cursor-pointer h-[200px] bg-white p-2 flex flex-col relative overflow-hidden">
                                        <Image
                                            key='about-page'
                                            src="/images/pavlo-talpa-zmv-_r6hbe8-unsplash.jpg"
                                            alt="About page"
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 " />
                                        <div className="relative flex flex-col justify-end h-full">
                                            <h1 className="text-lg font-bold truncate p-2 text-white">About Page</h1>
                                        </div>
                                    </Card>
                                </CarouselItem>
                            </CarouselContent>
                            <CarouselPrevious className="border-0 absolute top-1/2 left-0 -translate-y-1/2 z-[100]" />
                            <CarouselNext className="border-0 absolute top-1/2 right-0 -translate-y-1/2 z-[100]" />
                        </Carousel>
                    </motion.div>

                    <div className="space-y-4">
                        <h2 className="text-[5rem] font-bold text-gray-900">WORK</h2>
                        {/* <p className="text-lg text-gray-600 max-w-md">
                            Discover amazing content and explore our beautiful interface with smooth transitions.
                        </p> */}
                    </div>
                </div>
                {/* <motion.div ref={cursor} className='bg-amber-400 rounded-full w-10 h-10 absolute top-0 left-0 pointer-events-none z-50' variants={scaleAnimation} initial="initial" animate={active ? "enter" : "closed"}></motion.div> */}
                <motion.div ref={cursorLabel} className='bg-blue-800 text-white rounded-full px-3 py-4 absolute top-0 left-0 pointer-events-none z-50' variants={scaleAnimation} initial="initial" animate={active ? "enter" : "closed"}>View</motion.div>
            </motion.div>

            <div>
            </div>
            <footer className="p-6 text-center text-gray-500">
                <p>&copy; 2025 Dami UI. All rights reserved.</p>
            </footer>
        </motion.div>
    )
}

function AboutPage({ onNavigate }: { onNavigate: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex flex-col  bg-transparent"
        >
            {/* Full Screen Hero Image */}
            <motion.div layoutId="hero-image" className="absolute inset-0 ">
                <Image
                    src="/images/pavlo-talpa-zmv-_r6hbe8-unsplash.jpg"
                    alt="Hero Background"
                    width={1920}
                    height={1080}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 " />
            </motion.div>

            {/* Header */}
            {/* <header className="p-6 flex justify-between items-center relative z-10">
                <h1 className="text-2xl font-bold text-white">About Page</h1>
                <Button
                    onClick={onNavigate}
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                    Back to Home
                </Button>
            </header> */}

            {/* Main Content with Hero Animation */}
            <main className="flex-1 flex items-center justify-center px-6 bg-transparent z-50">
                <motion.div
                    initial={{ width: "50%", y: 100 }}
                    animate={{ width: "100%", y: 0 }}
                    transition={{
                        duration: 0.8,
                        delay: 0.3,
                        ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    className="text-center space-y-6 max-w-4xl  bg-transparent"
                >
                    <motion.h2
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.6,
                            delay: 0.6,
                            ease: "easeOut",
                        }}
                        className="text-5xl md:text-6xl font-bold text-white"
                    >
                        About Our Story
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.6,
                            delay: 0.8,
                            ease: "easeOut",
                        }}
                        className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed"
                    >
                        We are passionate about creating beautiful, interactive experiences that delight users and push the
                        boundaries of what's possible on the web. Our journey began with a simple idea: make the web more engaging.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            duration: 0.5,
                            delay: 1.0,
                            ease: "easeOut",
                        }}
                        className="flex gap-4 justify-center pt-4  bg-transparent"
                    >
                        <Button
                            onClick={onNavigate}
                            variant="outline"
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                            Back to Home
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                            <Link href='/about'>
                                Contact Us
                            </Link>
                        </Button>
                    </motion.div>
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="p-6 text-center text-white/70 relative z-10">
                <p>&copy; 2024 Your Company. All rights reserved.</p>
            </footer>
        </motion.div>
    )
}
