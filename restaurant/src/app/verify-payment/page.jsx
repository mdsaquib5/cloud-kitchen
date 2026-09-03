"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/services/api";
import { useStore } from "@/store/useStore";

const VerifyContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const order_id = searchParams.get("order_id");
    
    const [status, setStatus] = useState("verifying");
    const clearCart = useStore((state) => state.clearCart);
    const addActiveOrder = useStore((state) => state.addActiveOrder);
    const addPastOrder = useStore((state) => state.addPastOrder);

    useEffect(() => {
        if (!order_id) {
            setStatus("error");
            toast.error("Invalid payment reference");
            setTimeout(() => router.push("/"), 2000);
            return;
        }

        const verifyPayment = async () => {
            try {
                const res = await api.post("/payment/verify", { orderId: order_id });
                if (res.data.success) {
                    setStatus("success");
                    toast.success("Payment Successful! Order Confirmed.");
                    clearCart();
                    
                    if (res.data.order) {
                        addActiveOrder(res.data.order);
                        addPastOrder(res.data.order);
                    }
                    
                    // Add to active orders and redirect after a short delay
                    setTimeout(() => {
                        router.push(`/track-order?id=${order_id}`);
                    }, 2000);
                } else {
                    setStatus("failed");
                    toast.error("Payment failed or pending.");
                }
            } catch (error) {
                console.error(error);
                setStatus("failed");
                toast.error("Failed to verify payment status.");
            }
        };

        verifyPayment();
    }, [order_id, router, clearCart]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: '20px', textAlign: 'center' }}>
            {status === "verifying" && (
                <>
                    <div className="spinner" style={{ border: '4px solid #f3f3f3', borderTop: '4px solid #e11d48', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }}></div>
                    <h2 style={{ marginTop: '20px' }}>Verifying Payment...</h2>
                    <p style={{ color: '#666', marginTop: '10px' }}>Please don't close or refresh this page.</p>
                </>
            )}
            
            {status === "success" && (
                <>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#4CAF50', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '30px' }}>✓</div>
                    <h2 style={{ marginTop: '20px', color: '#4CAF50' }}>Payment Successful!</h2>
                    <p style={{ color: '#666', marginTop: '10px' }}>Redirecting to tracking page...</p>
                </>
            )}

            {status === "failed" && (
                <>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#f44336', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '30px' }}>✕</div>
                    <h2 style={{ marginTop: '20px', color: '#f44336' }}>Payment Failed</h2>
                    <p style={{ color: '#666', marginTop: '10px' }}>There was an issue verifying your payment. Please contact support if amount was deducted.</p>
                    <button 
                        onClick={() => router.push('/checkout')} 
                        style={{ marginTop: '20px', padding: '10px 20px', background: '#e11d48', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        Try Again
                    </button>
                </>
            )}
            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

const VerifyPayment = () => {
    return (
        <Suspense fallback={<div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>}>
            <VerifyContent />
        </Suspense>
    );
};

export default VerifyPayment;
