function Button ({children, disabled}){
    return(
        <button type="submit" style={styles.button} disabled={disabled}>
            {children}
        </button>
    );
}

//css
const styles = { 
    button: { 
        padding: '10px', 
        fontSize: '1rem', 
        cursor: 'pointer', 
    }, 
};

export default Button;

//'yup' para validar datos

//crear /back/server/api.js para declarar donde correra el servidor (URL)
//con axios

//mover todos los viejos schemas a typeORM

//mover 'Login' y 'Register' a auth/components/

//agregar los mensajes de yup al archivo de register