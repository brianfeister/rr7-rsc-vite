import type { ReactElement } from 'react';
import { Link } from 'react-router';
import { SiFacebook, SiInstagram, SiX, SiYoutube } from '@icons-pack/react-simple-icons';
import Signup from './signup';

export default function Footer(): ReactElement {
    return (
        <footer className="bg-foreground/90 py-12 mt-auto border-accent ring-secondary/40 text-muted-foreground/30">
            <div className="container mx-auto px-4 bg-foreground/20 border-secondary/50">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-muted-foreground/40">
                    {/* Customer Support */}
                    <div>
                        <h3 className="text-lg text-primary-foreground font-semibold mb-4">Customer Support</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/contact" className="text-primary-foreground hover:underline">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/shipping" className="text-primary-foreground hover:underline">
                                    Shipping
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Account */}
                    <div>
                        <h3 className="text-lg text-primary-foreground font-semibold mb-4">Account</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/orders" className="text-primary-foreground hover:underline">
                                    Order Status
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" className="text-primary-foreground hover:underline">
                                    Sign in or create account
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Our Company */}
                    <div>
                        <h3 className="text-lg text-primary-foreground font-semibold mb-4">Our Company</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/store-locator" className="text-primary-foreground hover:underline">
                                    Store Locator
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-primary-foreground hover:underline">
                                    About Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <Signup />

                        <div className="flex mt-6 space-x-3">
                            <a
                                href="https://youtube.com/channel/UCSTGHqzR1Q9yAVbiS3dAFHg"
                                aria-label="Youtube"
                                className="text-primary-foreground hover:underline">
                                <SiYoutube />
                            </a>
                            <a
                                href="https://instagram.com/commercecloud"
                                aria-label="Instagram"
                                className="text-primary-foreground hover:underline">
                                <SiInstagram />
                            </a>
                            <a
                                href="https://x.com/CommerceCloud"
                                aria-label="X"
                                className="text-primary-foreground hover:underline">
                                <SiX />
                            </a>
                            <a
                                href="https://facebook.com/CommerceCloud/"
                                aria-label="Facebook"
                                className="text-primary-foreground hover:underline">
                                <SiFacebook />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border/60">
                    <p className="text-center text-muted-foreground text-sm">
                        © {new Date().getFullYear()} Salesforce or its affiliates. All rights reserved. This is a demo
                        store only. Orders made WILL NOT be processed.
                    </p>
                </div>
            </div>
        </footer>
    );
}
