// components/ServiceCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import Card from "./Card";
import Button from "./Button";

const ServiceCard = ({ service }) => {
  return (
    <Card className="flex flex-col">
      <img
        src={service.image}
        alt={service.name}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      <h3 className="text-xl font-bold mb-2">{service.name}</h3>
      <p className="text-gray-600 mb-2 line-clamp-2">
        {service.description}
      </p>
      <p className="text-sm text-gray-500 mb-2">
        Category: <span className="font-semibold">{service.category}</span>
      </p>
      <p className="text-2xl font-bold text-blue-600 mb-4">
        ฿{service.price}/day
      </p>
      <p className="text-sm text-gray-500 mb-4">
        Available: {service.quantity} units
      </p>
      <Link to={`/service/${service._id}`} className="w-full">
        <Button variant="primary" className="w-full">
          View Details
        </Button>
      </Link>
    </Card>
  );
};

export default ServiceCard;
