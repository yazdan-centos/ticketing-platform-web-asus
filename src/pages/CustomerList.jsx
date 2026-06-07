import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Table, Form, Row, Col, Card, Pagination, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { customerListOptions } from '../queries/customers.queries';
import QueryStateHandler from '../hooks/QueryStateHandler';

const StyledCard = styled(Card)`
    margin-top: 2rem;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
`;

const CustomerList = () => {
    const [filters, setFilters] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        companyName: '',
        phone: '',
        deleted: '',
        page: 0,
        size: 20
    });

    const query = useQuery(customerListOptions(filters));

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value, page: 0 });
    };

    const handlePageChange = (newPage) => {
        setFilters({ ...filters, page: newPage });
    };

    return (
        <StyledCard>
            <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Customer Directory</h5>
                <Link to="/customers/create">
                    <Button variant="success" size="sm">+ New Customer</Button>
                </Link>
            </Card.Header>
            <Card.Body>
                <Form className="mb-4">
                    <Row className="mb-2">
                        <Col md={3}>
                            <Form.Control 
                                placeholder="First Name" 
                                name="firstName" 
                                value={filters.firstName} 
                                onChange={handleFilterChange} 
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Control 
                                placeholder="Last Name" 
                                name="lastName" 
                                value={filters.lastName} 
                                onChange={handleFilterChange} 
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Control 
                                placeholder="Username" 
                                name="username" 
                                value={filters.username} 
                                onChange={handleFilterChange} 
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Control 
                                placeholder="Email" 
                                name="email" 
                                value={filters.email} 
                                onChange={handleFilterChange} 
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={3}>
                            <Form.Control 
                                placeholder="Company" 
                                name="companyName" 
                                value={filters.companyName} 
                                onChange={handleFilterChange} 
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Control 
                                placeholder="Phone" 
                                name="phone" 
                                value={filters.phone} 
                                onChange={handleFilterChange} 
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Select 
                                name="deleted" 
                                value={filters.deleted} 
                                onChange={handleFilterChange}
                            >
                                <option value="">All Statuses</option>
                                <option value="false">Active</option>
                                <option value="true">Deleted</option>
                            </Form.Select>
                        </Col>
                    </Row>
                </Form>

                <QueryStateHandler query={query}>
                    {(data) => (
                        <>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Username</th>
                                        <th>Email</th>
                                        <th>Company</th>
                                        <th>Phone</th>
                                        <th>SLA Contracts</th>
                                        <th>Roles</th>
                                        <th>Created At</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.content.map(customer => (
                                        <tr key={customer.id}>
                                            <td>{customer.id}</td>
                                            <td>{customer.username}</td>
                                            <td>{customer.email}</td>
                                            <td>{customer.companyName}</td>
                                            <td>{customer.phone || '—'}</td>
                                            <td>{customer.slaContractIds?.join(', ') || 'None'}</td>
                                            <td>{customer.roles?.join(', ')}</td>
                                            <td>{customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : '—'}</td>
                                            <td>
                                                <Link to={`/customers/${customer.id}/edit`}>
                                                    <Button variant="outline-primary" size="sm">Edit</Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                            <Pagination className="justify-content-center">
                                <Pagination.First onClick={() => handlePageChange(0)} disabled={data.first} />
                                <Pagination.Prev onClick={() => handlePageChange(filters.page - 1)} disabled={data.first} />
                                {[...Array(data.totalPages).keys()].map(page => (
                                    <Pagination.Item 
                                        key={page} 
                                        active={page === filters.page}
                                        onClick={() => handlePageChange(page)}
                                    >
                                        {page + 1}
                                    </Pagination.Item>
                                ))}
                                <Pagination.Next onClick={() => handlePageChange(filters.page + 1)} disabled={data.last} />
                                <Pagination.Last onClick={() => handlePageChange(data.totalPages - 1)} disabled={data.last} />
                            </Pagination>
                        </>
                    )}
                </QueryStateHandler>
            </Card.Body>
        </StyledCard>
    );
};

export default CustomerList;
