import api from '../../../utils/api';

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import styles from './PetDetails.module.css';

/* hooks */
import useFlashMessage from '../../../hooks/useFlashMessage';

function PetDetails() {
    const [pet, setPet] = useState({});
    const { id } = useParams();
    const { setFlashMessage } = useFlashMessage();
    const [token] = useState(localStorage.getItem('token') || '');

    useEffect(() => {
        api.get(`/pets/${id}`).then((response) => {
            setPet(response.data.pet);
        });
    }, [id]);

    async function schedule() {
        let messageType = 'success';

        const data = await api
            .patch(`pets/schedule/${pet._id}`, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`,
                },
            })
            .then((response) => {
                return response.data;
            })
            .catch((err) => {
                messageType = 'error';
                return err.response.data;
            });

        setFlashMessage(data.message, messageType);
    }

    return (
        <>
            {pet.name && (
                <section className={styles.pet_details_container}>
                    <div className={styles.petdetails_header}>
                        <h1>Conhecendo o Pet: {pet.name}</h1>
                        <p>Se tiver interesse, marque uma visita para conhecê-lo!</p>
                    </div>
                    <div className={styles.pet_details_content}>
                        <div className={styles.pet_images}>
                            {pet.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={`${process.env.REACT_APP_API}/images/pets/${image}`}
                                    alt={pet.name}
                                />
                            ))}
                        </div>
                        <div className={styles.pet_info}>
                            <p>
                                <span className="bold">Peso:</span> {pet.weight}kg
                            </p>
                            <p>
                                <span className="bold">Idade:</span> {pet.age} anos
                            </p>
                            {token ? (
                                <button onClick={schedule}>Solicitar uma visita</button>
                            ) : (
                                <p className={styles.login_prompt}>
                                    Você precisa <Link to="/register">Criar uma conta</Link> para
                                    solicitar a visita.
                                </p>
                            )}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}

export default PetDetails;
