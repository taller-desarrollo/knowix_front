export function route(vm, path) {
    vm.$router.go(-1);
    vm.$router.replace(path);
}
