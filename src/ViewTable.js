import React, {useState, useEffect} from "react";
import 'bootstrap/dist/css/bootstrap.css';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'
import Spinner from 'react-bootstrap/Spinner'

export default function ViewTable() {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
            getData();
        }, [pageSize, currentPage]
    );

    return (
        <section>
            <h1>Table Result</h1>
            <DropdownButton
                alignRight
                title={"Entries per Table: " + pageSize}
                id="dropdown-menu-page-size"
                onSelect={handleSelect}
            >
                <Dropdown.Item eventKey="5">5</Dropdown.Item>
                <Dropdown.Item eventKey="10">10</Dropdown.Item>
                <Dropdown.Item eventKey="20">20</Dropdown.Item>
                <Dropdown.Item eventKey="50">50</Dropdown.Item>
                <Dropdown.Item eventKey="100">100</Dropdown.Item>
            </DropdownButton>
            <br/>
            <Button onClick={previousBtnClicked}>Previous</Button>
            <span> Current page: {currentPage} </span>
            <Button onClick={nextBtnClicked}>Next</Button>
            <br/><br/>

            {isLoading ? <Spinner animation='border' role="status"/> :

                <Table bordered hover>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Body</th>
                    </tr>
                    </thead>
                    <tbody>
                    {renderTableBody()}
                    </tbody>
                </Table>
            }
        </section>
    );

    function renderTableBody() {
        return data.map((post, index) => {
            const {id, title, body} = post //destructuring
            return (
                <tr key={id}>
                    <td>{id}</td>
                    <td>{title}</td>
                    <td>{body}</td>
                </tr>
            )
        })
    }

    function handleSelect(e) {
        setPageSize(e);
    }

    function nextBtnClicked() {
        setCurrentPage(currentPage + 1)
    }

    function previousBtnClicked() {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }

    async function getData() {
        setIsLoading(true);
        try {
            let response = await fetch('https://jsonplaceholder.typicode.com/posts?_page=' + currentPage
                + '&_limit=' + pageSize);
            let json = await response.json();
            if (json.length > 0) {
                json.forEach(x => {
                        if (x.body.length > 100) {
                            x.body = x.body.substring(0, 100);
                        }
                    }
                );
                setData(json);
            } else {
                setCurrentPage(currentPage - 1);
            }
        } catch (error) {
            console.log(error);
        }
        setIsLoading(false);
    }
}
