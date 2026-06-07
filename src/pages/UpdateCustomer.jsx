import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Form, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import styled from 'styled-components';
import { customerDetailOptions } from '../queries/customers.queries';
import { updateCustomerMutation } from '../mutations/customers.mutations';
import QueryStateHandler from '../hooks/QueryStateHandler';

const StyledCard = styled(Card)`
    margin-top: 2rem;
    max-width: 720px;
    margin-left: auto;
    margin-right: auto;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
`;

const UpdateCustomerForm = ({ customer }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        companyName: '',
        phone: '',
    });
    const [error, setError] = useState('');

    const mutation = useMutation(updateCustomerMutation());

    useEffect(() => {
        if (customer) {
            setFormData({
                username: customer.username || '',
                password: '',
                email: customer.email || '',
                companyName: customer.companyName || '',
                phone: customer.phone || '',
            });
        }
    }, [customer]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!formData.username || !formData.email) {
            setError('Username and email are required.');
            return;
        }

        const payload = {
            id: customer.id,
            username: formData.username,
            email: formData.email,
            roles: customer.roles || ['CUSTOMER'],
            companyName: formData.companyName || null,
            phone: formData.phone || null,
        };

        if (formData.password) {
            payload.password = formData.password;
        }

        mutation.mutate(payload, {
            onSuccess: () => {
                navigate('/customers');
            },
            onError: (err) => {
                setError(err.message || 'Failed to update customer.');
            },
        });
    };

    return (
        <>
            {error && <Alert variant="danger">{error}</Alert>}
            {mutation.isSuccess && <Alert variant="success">Customer updated successfully!</Alert>}

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
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Leave blank to keep current"
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
                                Updating...
                            </>
                        ) : (
                            'Update Customer'
                        )}
                    </Button>
                    <Button variant="secondary" onClick={() => navigate('/customers')}>
                        Cancel
                    </Button>
                </div>
            </Form>
        </>
    );
};

const UpdateCustomer = () => {
    const { id } = useParams();
    const query = useQuery(customerDetailOptions(id));

    return (
        <StyledCard>
            <Card.Header as="h5">Update Customer</Card.Header>
            <Card.Body>
                <QueryStateHandler query={query}>
                    {(customer) => <UpdateCustomerForm customer={customer} />}
                </QueryStateHandler>
            </Card.Body>
        </StyledCard>
    );
};

export default UpdateCustomer;
