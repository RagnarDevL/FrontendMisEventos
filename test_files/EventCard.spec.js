import { mount } from '@vue/test-utils';
import EventCard from '../src/components/EventCard.vue';

describe('EventCard.vue', () => {
  it('renders event information correctly', () => {
    const event = {
      name: 'Test Event',
      capacity: 100,
      date: '2023-10-01',
      description: 'This is a test event.'
    };
    const wrapper = mount(EventCard, {
      props: { event }
    });
    expect(wrapper.find('.event-title').text()).toBe('Test Event');
    expect(wrapper.find('.event-capacity').text()).toBe('Capacidad: 100 asistentes');
  });

  it('register button works correctly', async () => {
    const event = {
      id: 1,
      name: 'Test Event',
      capacity: 100,
      date: '2023-10-01',
      description: 'This is a test event.'
    };
    const wrapper = mount(EventCard, {
      props: { event }
    });
    await wrapper.find('.register-button').trigger('click');
    expect(wrapper.vm.isRegistered).toBe(true);
  });
});
