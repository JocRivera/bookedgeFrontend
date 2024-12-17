import React, { useState, useEffect } from "react";
import { DatePicker, Input, Select, SelectItem, Checkbox, Button, Card } from "@nextui-org/react";
import { Trash2 } from "lucide-react";

export default function BookForm() {
    const [password, setPassword] = React.useState("");
    const [submitted, setSubmitted] = React.useState(null);
    const [errors, setErrors] = React.useState({});
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [isEndDateDisabled, setIsEndDateDisabled] = useState(false);
    const [hasAccompanists, setHasAccompanists] = useState(false);
    const [accompanists, setAccompanists] = useState([]);
    const [numAccompanists, setNumAccompanists] = useState(1);

    // Real-time password validation
    const getPasswordError = (value) => {
        if (value.length < 4) {
            return "Password must be 4 characters or more";
        }
        if ((value.match(/[A-Z]/g) || []).length < 1) {
            return "Password needs at least 1 uppercase letter";
        }
        if ((value.match(/[^a-z]/gi) || []).length < 1) {
            return "Password needs at least 1 symbol";
        }

        return null;
    };
    useEffect(() => {
        if (hasAccompanists) {
            const currentCount = accompanists.length;
            const targetCount = parseInt(numAccompanists);

            if (currentCount < targetCount) {
                // Add new accompanists
                const newAccompanists = [...accompanists];
                for (let i = currentCount; i < targetCount; i++) {
                    newAccompanists.push({
                        id: Date.now() + i,
                        name: "",
                        documentType: "",
                        documentNumber: ""
                    });
                }
                setAccompanists(newAccompanists);
            } else if (currentCount > targetCount) {
                // Remove excess accompanists
                setAccompanists(accompanists.slice(0, targetCount));
            }
        }
    }, [numAccompanists, hasAccompanists]);

    // Reset accompanists when checkbox is unchecked
    useEffect(() => {
        if (!hasAccompanists) {
            setAccompanists([]);
            setNumAccompanists(1);
        }
    }, [hasAccompanists]);

    const handlePlanChange = (e) => {
        const selectedPlan = e.target.value;
        if (selectedPlan === "ca") {
            setIsEndDateDisabled(true);
            setEndDate(startDate);
        } else {
            setIsEndDateDisabled(false);
        }
    };

    const updateAccompanist = (id, field, value) => {
        setAccompanists(accompanists.map(acc =>
            acc.id === id ? { ...acc, [field]: value } : acc
        ));
    };
    const removeAccompanist = (id) => {
        setAccompanists(accompanists.filter(acc => acc.id !== id));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget));

        // Custom validation checks
        const newErrors = {};

        // Password validation
        const passwordError = getPasswordError(data.password);

        if (passwordError) {
            newErrors.password = passwordError;
        }

        // Username validation
        if (data.name === "admin") {
            newErrors.name = "Nice try! Choose a different username";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);

            return;
        }

        if (data.terms !== "true") {
            setErrors({ terms: "Please accept the terms" });

            return;
        }

        // Clear errors and submit
        setErrors({});
        setSubmitted(data);
    };

    return (
        <form
            id="reservation-form"
            className="w-full "
            validationBehavior="native"
            validationErrors={errors}
            onReset={() => setSubmitted(null)}
            onSubmit={onSubmit}
        >
            <div className="grid grid-cols-2 gap-6 ">
                <div className="flex flex-col max-w-md gap-4">
                    <Select
                        isRequired
                        label="Plan"
                        labelPlacement="outside"
                        name="plan"
                        placeholder="Select a plan"
                        onChange={handlePlanChange}
                    >
                        <SelectItem key="ar" value="ar">
                            Romantico
                        </SelectItem>
                        <SelectItem key="us" value="us">
                            Alojamiento
                        </SelectItem>
                        <SelectItem key="ca" value="ca">
                            Dia de sol
                        </SelectItem>
                        <SelectItem key="uk" value="uk">
                            Empresarial
                        </SelectItem>
                        <SelectItem key="au" value="au">
                            Masaje
                        </SelectItem>
                    </Select>
                    <div className="flex space-x-4">
                        <DatePicker
                            label="Fecha de inicio"
                            onChange={(date) => setStartDate(date)}
                            placeholder="mm/dd/yyyy"
                        />
                        <DatePicker
                            label="Fecha de Fin"
                            onChange={(date) => setEndDate(date)}
                            placeholder="mm/dd/yyyy"
                            isDisabled={isEndDateDisabled}
                        />
                    </div>
                    <Input
                        isRequired
                        errorMessage={({ validationDetails }) => {
                            if (validationDetails.valueMissing) {
                                return "Please enter your name";
                            }

                            return errors.name;
                        }}
                        label="Name"
                        labelPlacement="outside"
                        name="name"
                        placeholder="Enter your name"
                    />

                    <Input
                        isRequired
                        errorMessage={({ validationDetails }) => {
                            if (validationDetails.valueMissing) {
                                return "Please enter your email";
                            }
                            if (validationDetails.typeMismatch) {
                                return "Please enter a valid email address";
                            }
                        }}
                        label="Email"
                        labelPlacement="outside"
                        name="email"
                        placeholder="Enter your email"
                        type="email"
                    />

                    <div className="flex space-x-4">
                        <Select
                            isRequired
                            label="Tipo de documento"
                            labelPlacement="outside"
                            name="type"
                            placeholder="Select a type"
                        >
                            <SelectItem key="cc" value="cc">
                                Cedula de Ciudadania
                            </SelectItem>
                            <SelectItem key="ce" value="ce">
                                Cedula de Extranjeria
                            </SelectItem>
                            <SelectItem key="pp" value="pp">
                                Pasaporte
                            </SelectItem>
                        </Select>
                        <Input
                            isRequired
                            errorMessage={({ validationDetails }) => {
                                if (validationDetails.valueMissing) {
                                    return "Please enter your number";
                                }

                                return errors.name;
                            }}
                            label="Numero de documento"
                            labelPlacement="outside"
                            name="number"
                            placeholder="Enter your number"
                        />
                    </div>
                    <div className="grid gap-4 ">
                        <Checkbox
                            isSelected={hasAccompanists}
                            onValueChange={setHasAccompanists}>
                            Añadir acompañantes
                        </Checkbox>
                        {hasAccompanists && (
                            <Input
                                type="number"
                                min={1}
                                max={30}
                                label="Número de acompañantes"
                                labelPlacement="outside"
                                name="accompanists"
                                value={numAccompanists}
                                onChange={(e) => setNumAccompanists(e.target.value)}
                                required
                            />
                        )}
                    </div>
                    <div className="mb-4">
                        <Checkbox
                            isRequired
                            classNames={{
                                label: "text-small",
                            }}
                            isInvalid={!!errors.terms}
                            name="terms"
                            validationBehavior="aria"
                            value="true"
                            onValueChange={() => setErrors((prev) => ({ ...prev, terms: undefined }))}
                        >
                            I agree to the terms and conditions
                        </Checkbox></div>


                </div>
                <div className="flex flex-col max-w-md gap-4">
                    {hasAccompanists && (
                        <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto">
                            <h2 className="text-xl font-semibold">Acompañantes</h2>
                            {accompanists.map((accompanist, index) => (
                                <Card key={accompanist.id} className="p-4 shadow-none">
                                    <div className="flex flex-col gap-4">
                                        <Input
                                            isRequired
                                            label="Name"
                                            labelPlacement="outside"
                                            value={accompanist.name}
                                            onChange={(e) => updateAccompanist(accompanist.id, 'name', e.target.value)}
                                            placeholder="Enter accompanist name"
                                        />
                                        <div className="flex gap-4">
                                            <Select
                                                isRequired
                                                label="Tipo de documento"
                                                labelPlacement="outside"
                                                name="type"
                                                placeholder="Select a type"
                                                value={accompanist.documentType}
                                                onChange={(e) => updateAccompanist(accompanist.id, 'documentType', e.target.value)}
                                            >
                                                <SelectItem key="cc" value="cc">Cedula de Ciudadania</SelectItem>
                                                <SelectItem key="ce" value="ce">Cedula de Extranjeria</SelectItem>
                                                <SelectItem key="pp" value="pp">Pasaporte</SelectItem>
                                            </Select>
                                            <Input
                                                labelPlacement="outside"
                                                isRequired
                                                label="Document Number"
                                                value={accompanist.documentNumber}
                                                onChange={(e) => updateAccompanist(accompanist.id, 'documentNumber', e.target.value)}
                                                placeholder="Enter document number"
                                            />
                                        </div>
                                        <div className="flex items-center justify-between mb-2">
                                            <Button
                                                isIconOnly
                                                color="danger"
                                                size="sm"
                                                onPress={() => removeAccompanist(accompanist.id)}
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                    <h2 className="text-xl font-semibold">pagos</h2>
                </div>
            </div>
            {errors.terms && <span className="text-danger text-small">{errors.terms}</span>}
            <div className="flex gap-4">
                <Button type="reset" variant="bordered">
                    Reset
                </Button>
            </div>
            {submitted && (
                <div className="mt-4 text-small text-default-500">
                    Submitted data: <pre>{JSON.stringify(submitted, null, 2)}</pre>
                </div>
            )}
        </form>
    );
}

