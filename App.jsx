import { useState } from "react"
import clsx from "clsx"
import { colors } from "./colors"

export default function App2() {
    const [buttons, setButtons] = useState(colors)

    const getState = (array, name) => array.find(b => b.name === name)?.on
    const setState = (array, name, on) => {
        const idx = array.findIndex(b => b.name === name)
        if (idx !== -1) {
            array[idx] = { ...array[idx], on }
        }
    }

    const updateSecondaryColors = (buttonsList) => {
        const red = getState(buttonsList, "Red")
        const blue = getState(buttonsList, "Blue")
        const yellow = getState(buttonsList, "Yellow")

        setState(buttonsList, "Purple", red && blue)
        setState(buttonsList, "Orange", red && yellow)
        setState(buttonsList, "Green", blue && yellow)
        const brown = red && blue && yellow
        setState(buttonsList, "Brown", brown)

        if (brown) {
            buttonsList = buttonsList.map(btn => ({ ...btn, on: true }))
        }

        return buttonsList
    }

    const toggleColor = (color) => {
        let updatedButtons = [...buttons]

        const idx = updatedButtons.findIndex(b => b.name === color.name)
        if (idx === -1) return

        const isPrimary = ["Red", "Blue", "Yellow"].includes(color.name)
        const isSecondary = ["Green", "Purple", "Orange"].includes(color.name)

        if (color.name === "Brown") {
            const allOn = color.on
            updatedButtons = updatedButtons.map(btn => ({ ...btn, on: !allOn }))
            setButtons(updatedButtons)
            return
        }

        if (isPrimary) {
            // Flip the primary color
            updatedButtons[idx] = { ...updatedButtons[idx], on: !color.on }

        } else if (isSecondary) {
            // Determine related primaries
            const relatedPrimaries = {
                Purple: ["Red", "Blue"],
                Orange: ["Red", "Yellow"],
                Green: ["Blue", "Yellow"]
            }

            const components = relatedPrimaries[color.name] || []

            const turningOn = !color.on
            components.forEach(name => {
                setState(updatedButtons, name, turningOn)
            })

        }

        // After primaries updated, recalculate secondaries
        updatedButtons = updateSecondaryColors(updatedButtons)

        setButtons(updatedButtons)
    }

    return (
        <main>
            <section>
                <header>Color Pad</header>
                <h1>Select the Colors to see their Relationships</h1>
                <div className="buttonsContainer">
                    {buttons.map((button, index) => (
                        <div
                            key={index}
                            className={`${clsx({gray: !button.on})} ${button.name} `}
                            onClick={() => toggleColor(button)}
                        >
                            {button.name}
                        </div>
                
                    ))}
                </div>
            </section>
        </main>
    )
}
