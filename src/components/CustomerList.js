import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, Alert, Spinner } from 'react-bootstrap';
import axiosInstance from '../services/axiosSetup';
import { useNavigate } from 'react-router-dom';

const CustomerList = () => {
  const [clients, setClients] = useState([]);
  const [clientsFiltres, setClientsFiltres] = useState([]);
  const [villeSelectionnee, setVilleSelectionnee] = useState('');
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const recupererClients = async () => {
      try {
        const reponse = await axiosInstance.get('/get_list');
        setClients(reponse.data);
        setClientsFiltres(reponse.data);
      } catch (err) {
        setErreur('Erreur lors de la récupération de la liste des clients.');
      } finally {
        setChargement(false);
      }
    };

    recupererClients();
  }, []);

  const handleChangementVille = (event) => {
    const ville = event.target.value;
    setVilleSelectionnee(ville);

    if (ville) {
      setClientsFiltres(clients.filter(client => client.data?.city === ville));
    } else {
      setClientsFiltres(clients);
    }
  };

  const handleVoirDetails = (phoneNumber) => {
    navigate(`/customer/details/${phoneNumber}`);
  };

  if (chargement) return (
    <Container className="text-center my-4">
      <Spinner animation="border" variant="primary" />
    </Container>
  );

  if (erreur) return (
    <Container className="my-4">
      <Alert variant="danger">{erreur}</Alert>
    </Container>
  );

  const villes = [...new Set(clients.map(client => client.data?.city).filter(Boolean))];

  return (
    <section className="bg-light p-3 p-md-4 p-xl-5 d-flex align-items-center"
      style={{
        background: 'linear-gradient(180deg, #a2c2e0 10%, #1f78b4 100%)',
        padding: '3rem 0',
        margin: '0',
        minHeight: '100vh'
      }}>
      <Container>
        <Row className="justify-content-center align-items-center" style={{
                
                margin: 'auto'
            }}>
          <Col xs={12} md={12} lg={8} xl={7} xxl={10}>
            <Card className="border-0 shadow-sm rounded-4" >
              <Card.Body className="p-3 p-md-4 p-xl-5">
                <div className="mb-4">
                  <h2 className="h3 text-primary">Liste des Clients</h2>
                  <p className="text-muted">Filtrer les clients par ville.</p>
                </div>
                <Form.Group controlId="formVilleSelect" className="mb-4">
                  <Form.Label>Ville</Form.Label>
                  <Form.Control as="select" value={villeSelectionnee} onChange={handleChangementVille}>
                    <option value="">Toutes les villes</option>
                    {villes.map((ville, index) => (
                      <option key={index} value={ville}>
                        {ville}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Prénom</th>
                      <th>Nom</th>
                      <th>Email</th>
                      <th>Téléphone</th>
                      <th>Ville</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientsFiltres.map(client => (
                      <tr key={client.phone_number}>
                        <td>{client.first_name}</td>
                        <td>{client.last_name}</td>
                        <td>{client.mail_address}</td>
                        <td>{client.phone_number}</td>
                        <td>{client.data?.city || 'Non disponible'}</td>
                        <td>
                          <Button 
                            variant="primary" 
                            onClick={() => handleVoirDetails(client.phone_number)}
                          >
                            Voir Détails
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default CustomerList;