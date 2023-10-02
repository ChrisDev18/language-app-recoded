from io import BytesIO


def my_sort(line):
    line_fields = line.strip().split('\t')
    print(line_fields)
    amount = ord(line_fields[1])
    return amount


def sortTSV(file_path: str):
    file = open(file_path)
    contents = file.readlines()

    # sorting using our custom logic
    contents.sort(key=my_sort)

    # printing the sorting contents to stdout
    for line in contents:
        print(line)

    file.close()


sortTSV("Tatoeba/Tatoeba-ENG-FRA.csv")