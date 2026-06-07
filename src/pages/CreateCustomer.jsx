import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Form, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import styled from 'styled-components';
import { createCustomerMutation } from '../mutations/customers.mutations';

const StyledCard = styled(Card)`
    margin-top: 2rem;
    max-width: 720px;
    margin-left: auto;
    margin-right: auto;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
`;

const initialFormState = {
    username: '',
    password: '',
    email: '',
    companyName: '',
    phone: '',
};

const CreateCustomer = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(initialFormState);
    const [error, setError] = useState('');

    const mutation = useMutation(createCustomerMutation());

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!formData.username || !formData.password || !formData.email) {
            setError('Username, password, and email are required.');
            return;
        }

        const payload = {
            username: formData.username,
            password: formData.password,
            email: formData.email,
            roles: ['CUSTOMER'],
            companyName: formData.companyName || null,
            phone: formData.phone || null,
        };

        mutation.mutate(payload, {
            onSuccess: () => {
                navigate('/customers');
            },
            onError: (err) => {
                setError(err.message || 'Failed to create customer.');
            },
        });
    };

    return (
        <StyledCard>
            <Card.Header as="h5">Create Customer</Card.Header>
            <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {mutation.isSuccess && <Alert variant="success">Customer created successfully!</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Username *</Form.Label>
                                <Form.Control
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Enter username"
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Password *</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter password"
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Email *</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter email"
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Company Name</Form.Label>
                                <Form.Control
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    placeholder="Enter company name"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Phone</Form.Label>
                                <Form.Control
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter phone number"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="d-flex gap-2">
                        <Button variant="primary" type="submit" disabled={mutation.isPending}>
                            {mutation.isPending ? (
                                <>
                                    <Spinner size="sm" className="me-2" />
                                    Creating...
                                </>
                            ) : (
                                'Create Customer'
                            )}
                        </Button>
                        <Button variant="secondary" onClick={() => navigate('/customers')}>
                            Cancel
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </StyledCard>
    );
};

export default CreateCustomer;
