function AlertMessage({ type, alertMessage }) {

    let color = 'text-blue-800 rounded-lg bg-blue-50';

    if (type === 'success') {
        color = 'text-green-800 rounded-lg bg-green-50';
    } else if (type === 'danger') {
        color = 'text-red-800 rounded-lg bg-red-50';
    }

    return (

        <div className={"p-6 mb-6 text-base text " + color} role="alert">
            <span className="font-medium">{alertMessage}</span>
        </div>


    )
}

export default AlertMessage;