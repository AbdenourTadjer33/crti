import React from 'react';
import { route } from '@/Utils/helper';
import { Head } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';
import Breadcrumb from '@/Features/Breadcrumb/Breadcrumb';
import { FormWrapper } from '@/Components/ui/form';
import CreateForm from '@/Features/Manage/Project/CreateProject';




const create: React.FC<{}> = () => {
    return (
        <AuthLayout>
            <Head title={"nouveau projet"} />
            <div className="space-y-4" >
            </div>
            <FormWrapper>
                <CreateForm/>
            </FormWrapper>

        </AuthLayout>
    )
}

export default create;
