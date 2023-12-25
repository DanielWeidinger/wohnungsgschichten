class POI(object):
    def __init__(self, name, address):
        self._name = name
        self.address = address

    def get_name(self):
        return f"distance_{self._name}"


def POIs_to_indicies(POIs: list):
    return [poi.get_name() for poi in POIs]


def get_POIs():
    return []
