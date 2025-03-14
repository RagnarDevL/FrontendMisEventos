import { mount } from '@vue/test-utils';
import HomeView from '../src/components/Home/HomeView.vue';

describe('HomeView.vue', () => {
  it('renders correctly', () => {
    const wrapper = mount(HomeView);
    expect(wrapper.exists()).toBe(true);
  });

  it('has a button to add an event', () => {
    const wrapper = mount(HomeView);
    const button = wrapper.find('.add-event-button');
    expect(button.exists()).toBe(true);
  });
});
