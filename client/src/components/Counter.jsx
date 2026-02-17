import React, { useEffect, useState, useRef } from 'react';

const Counter = ({ target, symbol = '', label }) => {
    const [count, setCount] = useState(0);
    const elementRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    const duration = 2000; // 2 seconds
                    const steps = 50;
                    const increment = target / steps;
                    let current = 0;

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            setCount(target);
                            clearInterval(timer);
                        } else {
                            // Format to 1 decimal place if target is decimal, otherwise integer
                            const isDecimal = target % 1 !== 0;
                            setCount(isDecimal ? current.toFixed(1) : Math.ceil(current));
                        }
                    }, duration / steps);

                    observer.unobserve(elementRef.current);
                }
            },
            { threshold: 0.5 }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => observer.disconnect();
    }, [target]);

    return (
        <div style={{ textAlign: 'center' }} ref={elementRef}>
            <span className="counter" style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', color: 'var(--accent)' }}>
                {count}
            </span>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', color: 'var(--accent)' }}>
                {symbol}
            </span>
            <p style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em', marginTop: '0.5rem' }}>
                {label}
            </p>
        </div>
    );
};

export default Counter;
