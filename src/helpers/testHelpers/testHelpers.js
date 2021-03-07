// eslint-disable-next-line import/prefer-default-export
export async function asyncFlush(sut) {
  await new Promise((resolve) => setTimeout(resolve));
  sut.update();
}
