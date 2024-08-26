import React, { useState, useRef } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import axiosInstance from '../services/axiosSetup';
import countries from '../data/countries.json';

const AddCustomer = () => {
  const formRef = useRef(null); // Référence au formulaire
  const [customer, setCustomer] = useState({
    first_name: '',
    last_name: '',
    mail_address: '',
    phone_number: '',
    data: {
      card_number: '',
      city: '',
      country: '',
      birthday: '',
    },
    additionnal_data: {
      customer_cat: '',
      family: {
        father: '',
        mother: '',
        sister: '',
      }
    }
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fonction pour réinitialiser le formulaire
  const handleReset = (e) => {
    e.preventDefault();
    if (formRef.current) {
      formRef.current.reset(); // Réinitialise les champs du formulaire
    }
    setCustomer({ // Réinitialise l'état du formulaire
      first_name: '',
      last_name: '',
      mail_address: '',
      phone_number: '',
      data: {
        card_number: '',
        city: '',
        country: '',
        birthday: '',
      },
      additionnal_data: {
        customer_cat: '',
        family: {
          father: '',
          mother: '',
          sister: '',
        }
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setCustomer(prevCustomer => {
      if (name.startsWith('data.')) {
        // Gestion des champs dans l'objet data
        return {
          ...prevCustomer,
          data: {
            ...prevCustomer.data,
            [name.replace('data.', '')]: value
          }
        };
      } else if (name.startsWith('additionnal_data.family.')) {
        // Gestion des champs dans l'objet additionnal_data.family
        const subfield = name.replace('additionnal_data.family.', '');
        return {
          ...prevCustomer,
          additionnal_data: {
            ...prevCustomer.additionnal_data,
            family: {
              ...prevCustomer.additionnal_data.family,
              [subfield]: value
            }
          }
        };
      } else if (name.startsWith('additionnal_data.')) {
        // Gestion des champs dans l'objet additionnal_data directement
        return {
          ...prevCustomer,
          additionnal_data: {
            ...prevCustomer.additionnal_data,
            [name.replace('additionnal_data.', '')]: value
          }
        };
      } else {
        // Gestion des autres champs
        return {
          ...prevCustomer,
          [name]: value
        };
      }
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axiosInstance.post('/add_customers', customer);
      setShowSuccess(true);
      setShowError(false);
      handleReset(e); // Réinitialise le formulaire après une soumission réussie
    } catch (error) {
      console.error('Erreur lors de l\'ajout du client:', error);
      setShowSuccess(false);
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-light p-3 p-md-4 p-xl-5 d-flex align-items-center"
      style={{
        background: 'linear-gradient(180deg, #a2c2e0 10%, #1f78b4 100%)',
        padding: '3rem 0'
      }}>
      <Container>
        <Row className="justify-content-center align-items-center ">
          <Col xs={12} md={9} lg={7} xl={6} xxl={9}>
            <Card className="border-0 shadow-sm rounded-4">
              <Card.Body className="p-3 p-md-4 p-xl-5">
                <div className="mb-4">
                  <h2 className="h3 text-primary">Ajouter un Client</h2>
                  <p className="text-muted">Veuillez remplir les détails du client ci-dessous.</p>
                </div>
                {showSuccess && <Alert variant="success">Client ajouté avec succès!</Alert>}
                {showError && <Alert variant="danger">Erreur lors de l'ajout du client.</Alert>}
                <Form ref={formRef} onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="first_name">
                    <Form.Floating>
                      <Form.Control
                        type="text"
                        name="first_name"
                        placeholder="Prénom"
                        value={customer.first_name}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="first_name">Prénom</label>
                    </Form.Floating>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="last_name">
                    <Form.Floating>
                      <Form.Control
                        type="text"
                        name="last_name"
                        placeholder="Nom"
                        value={customer.last_name}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="last_name">Nom</label>
                    </Form.Floating>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="mail_address">
                    <Form.Floating>
                      <Form.Control
                        type="email"
                        name="mail_address"
                        placeholder="Email"
                        value={customer.mail_address}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="mail_address">Email</label>
                    </Form.Floating>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="phone_number">
                    <Form.Floating>
                        <Form.Control
                        type="tel"
                        name="phone_number"
                        placeholder="Téléphone"
                        value={customer.phone_number}
                        onChange={handleChange}
                        required
                        pattern="00229 [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}" // Ensures input matches the desired format
                        maxLength={14} // Limits input to the length of '00229 90 90 90 90'
                        onInput={(e) => {
                            // Automatically insert space after the country code and after every two digits
                            const formattedValue = e.target.value
                            .replace(/\D/g, '') // Remove non-digit characters
                            .replace(/^00229(\d{2})(\d{2})(\d{2})(\d{2})$/, '00229 $1 $2 $3 $4') // Format to '00229 90 90 90 90'
                            .replace(/(00229 \d{2} \d{2} \d{2} \d{2}).*/, '$1'); // Trim to correct format
                            e.target.value = formattedValue;
                            handleChange(e); // Ensure the formatted value updates the state
                        }}
                        />
                        <label htmlFor="phone_number">Téléphone</label>
                    </Form.Floating>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="card_number">
                    <Form.Floating>
                        <Form.Control
                        type="text"
                        name="data.card_number"
                        placeholder="Numéro de Carte"
                        value={customer.data.card_number}
                        onChange={handleChange}
                        required
                        pattern="\d{4}\s\d{4}\s\d{4}\s\d{4}" // Regex for 4 groups of 4 digits separated by spaces
                        maxLength={19} // Allows for 16 digits plus 3 spaces
                        onInput={(e) => {
                            // Automatically insert space after every 4 digits
                            const formattedValue = e.target.value
                            .replace(/\D/g, '') // Remove non-digit characters
                            .replace(/(\d{4})/g, '$1 ') // Add a space after every 4 digits
                            .trim(); // Trim trailing space
                            e.target.value = formattedValue;
                            handleChange(e); // Ensure the formatted value updates the state
                        }}
                        />
                        <label htmlFor="card_number">Numéro de Carte</label>
                    </Form.Floating>
                    </Form.Group>
                  <Form.Group className="mb-3" controlId="city">
                    <Form.Floating>
                      <Form.Control
                        type="text"
                        name="data.city"
                        placeholder="Ville"
                        value={customer.data.city}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="city">Ville</label>
                    </Form.Floating>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="country">
                    <Form.Floating>
                      <Form.Control
                        as="select"
                        name="data.country"
                        value={customer.data.country}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Sélectionnez un pays...</option>
                        {countries.map((country) => (
                          <option key={country.code} value={country.name}>
                            {country.name}
                          </option>
                        ))}
                      </Form.Control>
                      <label htmlFor="country">Pays</label>
                    </Form.Floating>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="birthday">
                    <Form.Floating>
                      <Form.Control
                        type="date"
                        name="data.birthday"
                        value={customer.data.birthday}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="birthday">Date de Naissance</label>
                    </Form.Floating>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="customer_cat">
                    <Form.Floating>
                      <Form.Control
                        as="select"
                        name="additionnal_data.customer_cat"
                        value={customer.additionnal_data.customer_cat}
                        onChange={handleChange}
                        
                      >
                        <option value="">Choisissez une catégorie...</option>
                        <option value="GOLD">GOLD</option>
                        <option value="SILVER">SILVER</option>
                        <option value="PREMIUM">PREMIUM</option>
                        <option value="IRON">IRON</option>
                      </Form.Control>
                      <label htmlFor="customer_cat">Catégorie du Client</label>
                    </Form.Floating>
                  </Form.Group>
                  <div className="mb-4">
                    <h4 className="fs-6 fw-normal text-secondary">Informations Familiales</h4>
                    <Form.Group className="mb-3" controlId="father">
                        <Form.Floating>
                        <Form.Control
                            type="text"
                            name="additionnal_data.family.father"
                            placeholder="Père"
                            value={customer.additionnal_data.family.father}
                            onChange={handleChange}
                        />
                        <label htmlFor="father">Père</label>
                        </Form.Floating>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="mother">
                        <Form.Floating>
                        <Form.Control
                            type="text"
                            name="additionnal_data.family.mother"
                            placeholder="Mère"
                            value={customer.additionnal_data.family.mother}
                            onChange={handleChange}
                        />
                        <label htmlFor="mother">Mère</label>
                        </Form.Floating>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="sister">
                        <Form.Floating>
                        <Form.Control
                            type="text"
                            name="additionnal_data.family.sister"
                            placeholder="Soeur"
                            value={customer.additionnal_data.family.sister}
                            onChange={handleChange}
                        />
                        <label htmlFor="sister">Soeur</label>
                        </Form.Floating>
                    </Form.Group>
                    </div>
                    <div className="d-flex justify-content-between">
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={isLoading}
                        className="w-100 me-2" // Utilisez w-48 pour ajuster la largeur des boutons et me-2 pour l'espacement
                    >
                        {isLoading ? <Spinner as="span" animation="border" size="sm" /> : 'Ajouter'}
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={handleReset}
                        className="w-100" // Utilisez w-48 pour ajuster la largeur des boutons
                    >
                        Réinitialiser
                    </Button>
                    </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AddCustomer;