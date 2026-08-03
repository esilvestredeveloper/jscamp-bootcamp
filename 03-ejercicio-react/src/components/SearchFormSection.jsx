export function SearchFormSection({ initialFilters, onFiltersChange }) {
    const handleFormChange = (event) => {
        const formData = new FormData(event.currentTarget)

        onFiltersChange({
            text: formData.get('search-value'),
            technology: formData.get('technology-value'),
            location: formData.get('location-value'),
            level: formData.get('experience-level-value'),
        })
    }

    // El formulario filtra al escribir, no al enviar: evitamos la recarga de la página
    const handleSubmit = (event) => {
        event.preventDefault()
    }

    return (
        <section className="jobs-search">
            <h1>Encuentra tu próximo trabajo</h1>
            <p>Explora miles de oportunidades en el sector tecnológico.</p>

            <form
                id="empleos-search-form"
                role="search"
                onChange={handleFormChange}
                onSubmit={handleSubmit}
            >
                <div className="search-bar">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                        <path d="M21 21l-6 -6" />
                    </svg>

                    <input
                        id="empleos-search-input"
                        type="text"
                        name="search-value"
                        placeholder="Buscar trabajos, empresas o habilidades"
                        defaultValue={initialFilters.text}
                    />
                </div>

                <div className="search-filters">
                    <select
                        name="technology-value"
                        id="filter-technology"
                        defaultValue={initialFilters.technology}
                    >
                        {/* Hacemos coincidir los valores con los de la API */}
                        <option value="">Tecnología</option>
                        <optgroup label="Frontend">
                            <option value="javascript">JavaScript</option>
                            <option value="typescript">TypeScript</option>
                            <option value="react">React</option>
                            <option value="react-native">React Native</option>
                            <option value="css">CSS</option>
                        </optgroup>
                        <optgroup label="Backend y datos">
                            <option value="node">Node.js</option>
                            <option value="python">Python</option>
                            <option value="golang">Go</option>
                            <option value="sql">SQL</option>
                            <option value="mongodb">MongoDB</option>
                        </optgroup>
                        <optgroup label="Cloud y DevOps">
                            <option value="aws">AWS</option>
                            <option value="azure">Azure</option>
                            <option value="docker">Docker</option>
                            <option value="kubernetes">Kubernetes</option>
                        </optgroup>
                    </select>

                    <select
                        name="location-value"
                        id="filter-location"
                        defaultValue={initialFilters.location}
                    >
                        <option value="">Ubicación</option>
                        <option value="remoto">Remoto</option>
                        <option value="madrid">Madrid</option>
                        <option value="barcelona">Barcelona</option>
                        <option value="valencia">Valencia</option>
                        <option value="cdmx">Ciudad de México</option>
                        <option value="guadalajara">Guadalajara</option>
                        <option value="monterrey">Monterrey</option>
                        <option value="bogota">Bogotá</option>
                        <option value="lima">Lima</option>
                        <option value="santiago">Santiago</option>
                        <option value="bsas">Buenos Aires</option>
                    </select>

                    <select
                        name="experience-level-value"
                        id="filter-experience-level"
                        defaultValue={initialFilters.level}
                    >
                        <option value="">Nivel de experiencia</option>
                        <option value="junior">Junior</option>
                        <option value="mid">Mid-level</option>
                        <option value="senior">Senior</option>
                    </select>
                </div>
            </form>

            <span id="filter-selected-value"></span>
        </section>
    )
}
