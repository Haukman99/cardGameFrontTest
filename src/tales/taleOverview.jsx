import React from 'react';
import { NavLink } from "react-router-dom";

  export default function taleOverview() {
    return (
        <div>
            <h1>Tales from Ghost Town Island + Flesh &amp; Souls</h1>
            <h2>
                <NavLink className="navLink" to='/tale1'>Tale 1. The Jar</NavLink>
            </h2>
            <h2>
                <NavLink className="navLink" to='/tale2'>Tale 2.</NavLink>
            </h2>
            <h2>
                <NavLink className="navLink" to='/tale3'>Tale 3. A guide to the SpectralNet</NavLink>
            </h2>
            <h2>
                <NavLink className="navLink" to='/tale4'>Tale 4. Evil Ghosts and Rituals</NavLink>
            </h2>
            <h2>
                <NavLink className="navLink" to='/tale5'>Tale 5. The beginning of Ghost Town Island</NavLink>
            </h2>
            <h2>
                <NavLink className="navLink" to='/card'>Flesh &amp; Souls</NavLink>
            </h2>
        </div>
    )
}
  