const pictureRepository = require("./pictureRepository");
const testHelpers = require("../../test/helpers");

let pictureExample1;

beforeEach(() => {
    pictureExample1 = testHelpers.getPictureExample1();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();
});

test('insert picture and findById work', async () => {
    const insertPictureResult = await pictureRepository.insert(pictureExample1);
    const findPictureResult = await pictureRepository.findById(insertPictureResult.rows[0].id);

    expect(insertPictureResult.rows[0]).toMatchObject(findPictureResult.rows[0]);
});

test('update picture works', async () => {
    const insertPictureResult = await pictureRepository.insert(pictureExample1);
    const findPictureResult = await pictureRepository.findById(insertPictureResult.rows[0].id);
    pictureExample1.pictureLocation = "NewLocation";
    pictureExample1.id = findPictureResult.rows[0].id;
    const updateResult = await pictureRepository.update(pictureExample1);
    const findPictureResultUpdate = await pictureRepository.findById(updateResult.rows[0].id);
    expect(updateResult.rows[0]).toMatchObject(findPictureResultUpdate.rows[0]);
    expect(findPictureResultUpdate.rows[0]).not.toMatchObject(findPictureResult.rows[0]);
    expect(findPictureResultUpdate.rows[0].pictureLocation).toBe("NewLocation");
    expect(findPictureResultUpdate.rows[0].id).toBe(insertPictureResult.rows[0].id);
});

test('delete picture works', async () => {
    const insertPictureResult = await pictureRepository.insert(pictureExample1);
    const id = insertPictureResult.rows[0].id;
    await pictureRepository.findById(id);

    await pictureRepository.removeById(id);
    const findPictureDeleteResult = await pictureRepository.findById(id);

    expect(findPictureDeleteResult.rowCount).toBe(0);
});
