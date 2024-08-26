import React, { useState, useEffect } from 'react';
import { Container, Card, Spinner, Alert, Button, Table } from 'react-bootstrap';
import axiosInstance from '../services/axiosSetup';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';

const CustomerDetails = () => {
  const { phone_number } = useParams();
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const response = await axiosInstance.get(`/details_customers/${phone_number}`);
        setCustomer(response.data.details_customers);
      } catch (err) {
        console.error('Erreur:', err);
        setError('Erreur lors de la récupération des détails du client');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomerDetails();
  }, [phone_number]);

  const handleBack = () => {
    navigate('/customer/list');
  };

  if (isLoading) return (
    <Container className="text-center my-4">
      <Spinner animation="border" variant="primary" />
      <p>Chargement des détails...</p>
    </Container>
  );
  
  if (error) return (
    <Container className="my-4">
      <Alert variant="danger">{error}</Alert>
    </Container>
  );

  return (
    <Container
      className="my-4"
      style={{ backgroundColor: '#f8f9fa', padding: '2rem', borderRadius: '8px' }}
    >
      <Button 
        variant="secondary" 
        onClick={handleBack}
        className="mb-3"
      >
        Retour à la liste des clients
      </Button>
      {customer && (
        <Card>
          <Card.Header className="bg-primary text-white">Informations du Client</Card.Header>
          <Card.Body>
            <Table striped bordered hover responsive>
              <tbody>
                <tr>
                  <td><strong>Nom :</strong></td>
                  <td>{customer.first_name} {customer.last_name}</td>
                </tr>
                <tr>
                  <td><strong>Email :</strong></td>
                  <td>{customer.mail_address}</td>
                </tr>
                <tr>
                  <td><strong>Téléphone :</strong></td>
                  <td>{customer.phone_number}</td>
                </tr>
                <tr>
                  <td><strong>Numéro de Carte :</strong></td>
                  <td>{customer.data?.card_number || 'Non disponible'}</td>
                </tr>
                <tr>
                  <td><strong>Ville :</strong></td>
                  <td>{customer.data?.city || 'Non disponible'}</td>
                </tr>
                <tr>
                  <td><strong>Pays :</strong></td>
                  <td>{customer.data?.country || 'Non disponible'}</td>
                </tr>
                <tr>
                  <td><strong>Date de Naissance :</strong></td>
                  <td>{customer.data?.birthday ? moment(customer.data.birthday).format('DD/MM/YYYY') : 'Non disponible'}</td>
                </tr>
                <tr>
                  <td><strong>Catégorie :</strong></td>
                  <td>{customer.additionnal_data?.customer_cat || 'Non disponible'}</td>
                </tr>
                <tr>
                  <td><strong>Père :</strong></td>
                  <td>{customer.additionnal_data?.family?.father || 'Non disponible'}</td>
                </tr>
                <tr>
                  <td><strong>Mère :</strong></td>
                  <td>{customer.additionnal_data?.family?.mother || 'Non disponible'}</td>
                </tr>
                <tr>
                  <td><strong>Soeur :</strong></td>
                  <td>{customer.additionnal_data?.family?.sister || 'Non disponible'}</td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default CustomerDetails;