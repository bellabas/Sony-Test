from random import randint


def generate_grid(n: int, m: int) -> list[list[int]]:
    if n < 0 or n > 100 or m < 0 or m > 100:
        raise ValueError("Grid size must be between 1 and 100")

    grid: list[list[int]] = [[randint(0, 1) for _ in range(m)] for _ in range(n)]

    grid[0][0] = 0
    grid[n-1][m-1] = 0
    return grid


def find_paths(grid: list[list[int]]) -> int:
    n: int = len(grid)
    m: int = len(grid[0])

    if grid[0][0] == 1 or grid[n-1][m-1] == 1:
        return 0

    dp: list[list[int]] = [[0 for _ in range(m)] for _ in range(n)]
    # we are carrying this 1 until paths are not met
    dp[0][0] = 1

    for i in range(n):
        for j in range(m):
            # you can not step onto obstacles so there is no path to this place
            if grid[i][j] == 1:
                dp[i][j] = 0
            else:
                # add together the path nums from previous steps on the current location
                if i > 0:
                    dp[i][j] += dp[i-1][j]
                if j > 0:
                    dp[i][j] += dp[i][j-1]
    return dp[n-1][m-1]


if __name__ == "__main__":
    num_paths = 0
    while num_paths == 0:
        grid = generate_grid(10, 10)
        print("Map:")
        for row in grid:
            print(row)
        print("")
        num_paths = find_paths(grid)
        print(f"Number of paths found: {num_paths}")
        print("\n")
