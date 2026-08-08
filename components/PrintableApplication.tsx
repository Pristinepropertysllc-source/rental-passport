import { Fragment } from 'react';
import type {
  Passport,
  Occupant,
  Pet,
  Vehicle,
  RentalHistoryEntry,
  EmploymentEntry,
  References
} from '@prisma/client';

type FullPassport = Passport & {
  occupants: Occupant[];
  pets: Pet[];
  vehicles: Vehicle[];
  rentalHistory: RentalHistoryEntry[];
  employment: EmploymentEntry[];
  references: References[];
};

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <tr>
      <td className="pa-label">{label}</td>
      <td className="pa-value">{value || ''}</td>
    </tr>
  );
}

export function PrintableApplication({
  passport,
  applicantName,
  email
}: {
  passport: FullPassport;
  applicantName: string;
  email: string;
}) {
  return (
    <div className="printable-app">
      <h1 className="pa-title">Prospect Application Detail</h1>
      <div className="pa-subtitle">{applicantName} (Applicant)</div>

      <table className="pa-table">
        <thead>
          <tr>
            <th>Field Name</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <Row label="First Name" value={passport.firstName} />
          <Row label="Last Name" value={passport.lastName} />
          <Row label="Street Address" value={passport.streetAddress} />
          <Row label="City" value={passport.city} />
          <Row label="State" value={passport.state} />
          <Row label="Zip" value={passport.zip} />
          <Row label="Date of Birth" value={passport.dateOfBirth} />
          <Row label="Home Phone" value={passport.homePhone} />
          <Row label="Mobile Phone" value={passport.mobilePhone} />
          <Row label="SSN" value={passport.ssn} />
          <Row label="Annual Income" value={passport.annualIncome} />
          <Row label="Email" value={email} />
          <Row label="Which property are you applying to?" value={passport.propertyApplyingTo} />
          <Row label="Are you Active Military?" value={passport.activeMilitary} />
          <Row label="Do you have past judgements, or lawsuits?" value={passport.pastJudgments} />
          <Row label="Have you been arrested, or convicted for a crime?" value={passport.arrestedConvicted} />
          <Row label="When Do you Want to Move In?" value={passport.moveInDate} />

          {passport.occupants.map((o) => (
            <Fragment key={o.id}>
              <Row key={`${o.id}-fn`} label="First Name" value={o.firstName} />
              <Row key={`${o.id}-ln`} label="Last Name" value={o.lastName} />
              <Row key={`${o.id}-dob`} label="Date of Birth" value={o.dateOfBirth} />
              <Row key={`${o.id}-rel`} label="Relationship" value={o.relationship} />
            </Fragment>
          ))}

          {passport.pets.map((p) => (
            <Fragment key={p.id}>
              <Row key={`${p.id}-ty`} label="Type" value={p.type} />
              <Row key={`${p.id}-br`} label="Breed" value={p.breed} />
              <Row key={`${p.id}-sz`} label="Size (lbs.)" value={p.sizeLbs} />
              <Row key={`${p.id}-cl`} label="Color" value={p.color} />
            </Fragment>
          ))}

          {passport.rentalHistory.map((r) => (
            <Fragment key={r.id}>
              <Row key={`${r.id}-mi`} label="Move In" value={r.moveIn} />
              <Row key={`${r.id}-mo`} label="Move Out" value={r.moveOut} />
              <Row key={`${r.id}-ll`} label="Landlord" value={r.landlord} />
              <Row key={`${r.id}-lp`} label="Landlord Phone" value={r.landlordPhone} />
              <Row key={`${r.id}-st`} label="Street Address" value={r.street} />
              <Row key={`${r.id}-ci`} label="City" value={r.city} />
              <Row key={`${r.id}-sta`} label="State" value={r.state} />
              <Row key={`${r.id}-zi`} label="Zip" value={r.zip} />
              <Row key={`${r.id}-ra`} label="Rent Amount" value={r.rentAmount} />
              <Row key={`${r.id}-rfl`} label="Reason for leaving" value={r.reasonForLeaving} />
              <Row key={`${r.id}-le`} label="Landlord Email Contact" value={r.landlordEmail} />
            </Fragment>
          ))}

          {passport.employment.map((e) => (
            <Fragment key={e.id}>
              <Row key={`${e.id}-ds`} label="Date Start" value={e.dateStart} />
              <Row key={`${e.id}-de`} label="Date End" value={e.dateEnd} />
              <Row key={`${e.id}-en`} label="Employer Name" value={e.employerName} />
              <Row key={`${e.id}-po`} label="Position" value={e.position} />
              <Row key={`${e.id}-su`} label="Supervisor" value={e.supervisor} />
              <Row key={`${e.id}-ph`} label="Phone" value={e.phone} />
              <Row key={`${e.id}-ad`} label="Address" value={e.address} />
              <Row key={`${e.id}-sa`} label="Salary" value={e.salary} />
            </Fragment>
          ))}

          {passport.vehicles.map((v) => (
            <Fragment key={v.id}>
              <Row key={`${v.id}-na`} label="Name" value={v.ownerName} />
              <Row key={`${v.id}-ad`} label="Address" value={v.ownerAddress} />
              <Row key={`${v.id}-hp`} label="Home Phone" value={v.ownerHomePhone} />
              <Row key={`${v.id}-de`} label="Description (Color Etc.)" value={v.description} />
              <Row key={`${v.id}-lp`} label="License Plate #" value={v.licensePlate} />
              <Row key={`${v.id}-st`} label="State" value={v.state} />
              <Row key={`${v.id}-mk`} label="Make" value={v.make} />
              <Row key={`${v.id}-mo`} label="Model" value={v.model} />
              <Row key={`${v.id}-yr`} label="Year" value={v.year} />
            </Fragment>
          ))}

          {passport.references.map((r) => (
            <Fragment key={r.id}>
              <Row key={`${r.id}-na`} label="Name" value={r.name} />
              <Row key={`${r.id}-ad`} label="Address" value={r.address} />
              <Row key={`${r.id}-hp`} label="Home Phone" value={r.homePhone} />
              <Row key={`${r.id}-mp`} label="Mobile Phone" value={r.mobilePhone} />
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
