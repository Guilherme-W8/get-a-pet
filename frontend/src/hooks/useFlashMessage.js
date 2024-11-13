import bus from '../utils/bus.js';

export default function useFlashMessage() {
    function setFlashMessage(message, type) {
        bus.emit('flash', {
            message: message,
            type: type
        });
    }

    return { setFlashMessage }
}