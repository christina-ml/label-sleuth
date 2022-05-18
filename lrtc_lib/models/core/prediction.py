from dataclasses import dataclass


@dataclass
class Prediction:
    """
    An object containing model predictions for a single element.
    Each model.infer method should return at least the label and score fields. In order for a model to return
    additional fields (e.g model embeddings), a different dataclass that inherits from this one, and adds the desired
    fields, can be used.
    """
    label: bool
    score: float

    def __post_init__(self):
        # Since many models return numpy objects, which are not json-serializable, we convert them here
        self.label = bool(self.label)
        self.score = float(self.score)

        if self.score < 0 or self.score > 1:
            raise Exception(f'Model score {self.score} is outside the range [0-1]')
