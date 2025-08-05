"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    
    useEffect(() => {
        // Redirection vers la page users
        router.push("/users");
    }, [router]);

    return null;
}
