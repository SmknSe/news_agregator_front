import '../styles/ReactInput.css'

function ReactInput({ imgSrc, value, onChange, type, placeholder, style, onKeyDown }) {
    return (
        <div className="input-wrap bordered" style={style}>
            <div className="input-logo">
                <img src={imgSrc} alt="user" />
            </div>
            <input type={type} required placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={onKeyDown ? ((e) => onKeyDown(e)) : null}></input>
        </div>
    );
}

export default ReactInput;