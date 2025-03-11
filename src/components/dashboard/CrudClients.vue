<script setup>
import { addClient, deleteClient, editClient, fetchClients } from '@/api/clientAPI';

import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const toast = useToast();
const clientes = ref([]);
const clienteDialog = ref(false);
const deleteClienteDialog = ref(false);
const cliente = ref({});
const submitted = ref(false);
const filters = ref({
    global: { value: null, matchMode: 'contains' }
});

onMounted(() => {
    loadClientes();
});

const loadClientes = async () => {
    try {
        clientes.value = await fetchClients();
    } catch (error) {
        console.error('Error cargando clientes', error);
    }
};

const openNew = () => {
    cliente.value = {};
    submitted.value = false;
    clienteDialog.value = true;
};

const hideDialog = () => {
    clienteDialog.value = false;
    submitted.value = false;
};

const saveCliente = async () => {
    toast.removeAllGroups();
    submitted.value = true;
    if (!cliente.value.name || !cliente.value.email || (!cliente.value.id && !cliente.value.numberId)) {
        toast.add({ severity: 'warn', summary: 'Validación', detail: 'Por favor, complete todos los campos obligatorios.', life: 3000 });
        return;
    }
    try {
        if (cliente.value.id) {
            await editClient(cliente.value.id, {
                name: cliente.value.name,
                email: cliente.value.email
            });
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente actualizado', life: 3000 });
        } else {
            await addClient(cliente.value);
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente creado', life: 3000 });
        }
        clienteDialog.value = false;
        loadClientes();
    } catch (error) {
        if (error.response?.data?.message) {
            const mensajes = Array.isArray(error.response.data.message) ? error.response.data.message : [error.response.data.message];

            mensajes.forEach((msg) => {
                toast.add({ severity: 'error', summary: 'Error', detail: msg, life: 3000 });
            });
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar', life: 3000 });
        }
    }
};

const editCliente = (c) => {
    cliente.value = { ...c };
    clienteDialog.value = true;
};

const confirmDeleteCliente = (c) => {
    cliente.value = c;
    deleteClienteDialog.value = true;
};

const deleteCliente = async () => {
    try {
        await deleteClient(cliente.value.id);
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente eliminado', life: 3000 });
        deleteClienteDialog.value = false;
        loadClientes();
    } catch (error) {
        console.error('Error eliminando cliente', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar', life: 3000 });
    }
};
</script>

<template>
    <div>
        <Toast />
        <Toolbar>
            <template #start>
                <Button label="Nuevo Cliente" icon="pi pi-plus" class="p-button-success" @click="openNew" />
            </template>
        </Toolbar>

        <DataTable :value="clientes" dataKey="id" paginator :rows="10" filterDisplay="menu" :filters="filters" responsiveLayout="scroll">
            <Column style="width: 3rem" />
            <Column field="name" header="Nombre" sortable />
            <Column field="email" header="Correo" sortable />
            <Column field="numberId" header="Cedula / RNC" sortable />
            <Column header="Acciones">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-primary" @click="editCliente(slotProps.data)" />
                    <Button icon="pi pi-trash" class="p-button-rounded p-button-danger ml-4" @click="confirmDeleteCliente(slotProps.data)" />
                </template>
            </Column>
        </DataTable>

        <Dialog v-model:visible="clienteDialog" header="Detalles del Cliente" modal :style="{ width: '600px' }">
            <div class="p-fluid">
                <div class="p-field">
                    <label class="p-button-text mr-4" for="nombre">Nombre</label>
                    <InputText id="nombre" v-model="cliente.name" required autofocus :invalid="submitted && !cliente.name" fluid />
                    <small v-if="submitted && !cliente.name" class="text-red-500">Name is required.</small>
                </div>
                <div class="p-field">
                    <label class="p-button-text mr-4" for="email" required autofocus :invalid="submitted && !cliente.email">Correo</label>
                    <InputText id="email" v-model="cliente.email" fluid />
                    <small v-if="submitted && !cliente.email" class="text-red-500">Email is required.</small>
                </div>
                <div class="p-field" v-if="!cliente.id" required autofocus :invalid="submitted && !cliente.numberId">
                    <label class="p-button-text mr-4" for="telefono">Cedula o RNC</label>
                    <InputText id="telefono" v-model="cliente.numberId" fluid />
                    <small v-if="submitted && !cliente.numberId" class="text-red-500">NumberId or RNC is required.</small>
                </div>
            </div>
            <template #footer>
                <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                <Button label="Guardar" icon="pi pi-check" class="p-button-text ml-4" @click="saveCliente" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteClienteDialog" header="Confirmar" modal :style="{ width: '350px' }">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle" style="font-size: 2rem" />
                <span
                    >¿Seguro que quieres eliminar a <b>{{ cliente.name }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteClienteDialog = false" />
                <Button label="Sí" icon="pi pi-check" class="p-button-text" @click="deleteCliente" />
            </template>
        </Dialog>
    </div>
</template>

<style scoped>
.p-field {
    margin-bottom: 1rem;
}

.confirmation-content {
    display: flex;
    align-items: center;
    gap: 1rem;
    text-align: center;
}
</style>
