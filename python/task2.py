class Employee:
    def __init__(self, emp_id, manager_id, rating):
        self.emp_id = emp_id
        self.manager_id = manager_id
        self.rating = rating


class TreeNode:
    def __init__(self, data):
        self.data = data
        self.children: list[TreeNode] = []


class EmployeeTree:
    def __init__(self):
        self.root: TreeNode = None

    def build_tree(self, employees: list[dict]) -> None:
        # create dict for easy access of nodes
        nodes: dict[int, TreeNode] = {}
        for emp in employees:
            emp_obj = Employee(emp['id'], emp['manager_id'], emp['rating'])
            emp_node = TreeNode(emp_obj)
            nodes[emp['id']] = emp_node

        for emp in employees:
            emp_node = nodes[emp['id']]
            if emp['manager_id'] is None:
                self.root = emp_node
            else:
                nodes[emp['manager_id']].children.append(emp_node)


class EmployeeRatingCalculator:
    @staticmethod
    def get_propagated_ratings(tree: EmployeeTree) -> dict:
        ratings = {}
        EmployeeRatingCalculator._calculate(tree.root, ratings)
        return ratings

    @staticmethod
    def _calculate(node: TreeNode, ratings: dict):
        if node is None:
            return 0

        if not node.children:
            ratings[node.data.emp_id] = node.data.rating
            return node.data.rating

        total_rating = node.data.rating
        for child in node.children:
            total_rating += EmployeeRatingCalculator._calculate(child, ratings)

        propagated_rating = total_rating / (len(node.children) + 1)
        ratings[node.data.emp_id] = propagated_rating
        return propagated_rating

    @staticmethod
    def format_result(ratings_result: dict) -> dict[int, str]:
        # order by ids
        ratings_result = dict(sorted(ratings_result.items()))
        # I thought I would format the output for consistent displaying
        ratings_result = {k: f"{v:.2f}" for k, v in ratings_result.items()}
        return ratings_result


def main():
    employees = [
        {"id": 1, "manager_id": None, "rating": 8},
        {"id": 2, "manager_id": 1, "rating": 7},
        {"id": 3, "manager_id": 1, "rating": 9},
        {"id": 4, "manager_id": 2, "rating": 6},
        {"id": 5, "manager_id": 2, "rating": 5},
        {"id": 6, "manager_id": 3, "rating": 10}
    ]

    employee_tree = EmployeeTree()
    employee_tree.build_tree(employees)
    result = EmployeeRatingCalculator.get_propagated_ratings(employee_tree)
    result = EmployeeRatingCalculator.format_result(result)
    print(result)


if __name__ == "__main__":
    main()
