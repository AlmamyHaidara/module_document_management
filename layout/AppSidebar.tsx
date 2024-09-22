import { Suspense } from 'react';
import AppMenu from './AppMenu';

const AppSidebar = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AppMenu />;
        </Suspense>
    );
};

export default AppSidebar;
