export default class ActiveRouteBlazeError extends Error {
  constructor() {
    super();
    this.name = 'activeroute:blaze';
  }
}
