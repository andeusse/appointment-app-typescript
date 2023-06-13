export default interface IAppointments {
  doctor: IDoctor;
  availableAppointmens: string[];
}

export interface IDoctor {
  _id: string;
  name: string;
  userType: string;
}
