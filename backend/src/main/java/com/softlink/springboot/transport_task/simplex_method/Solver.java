package com.softlink.springboot.transport_task.simplex_method;

import com.softlink.springboot.transport_task.entity.Solution;
import com.softlink.springboot.transport_task.entity.TransportTask;
import org.apache.commons.math3.optim.*;
import org.apache.commons.math3.optim.linear.*;
import org.apache.commons.math3.optim.nonlinear.scalar.GoalType;
import org.apache.commons.math3.optim.linear.LinearConstraintSet;

import java.util.ArrayList;
import java.util.List;

public interface Solver {
    static Solution solveTransportationProblem(TransportTask task)  {
        int[][] matrix = task.getMatrix();
        int[] supplies = task.getSupplies();
        int[] needs = task.getNeeds();


        int m = supplies.length;
        int n = needs.length;

        // Переменных: m * n
        int numVars = m * n;

        // Целевая функция: минимизация суммы c_ij * x_ij
        double[] coefficients = new double[numVars];
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                coefficients[i * n + j] = matrix[i][j];
            }
        }

        LinearObjectiveFunction f = new LinearObjectiveFunction(coefficients, 0);

        // Ограничения:
        List<LinearConstraint> constraints = new ArrayList<>();

        // 1. По поставкам: sum_j x_ij = supply_i
        for (int i = 0; i < m; i++) {
            double[] coeff = new double[numVars];
            for (int j = 0; j < n; j++) {
                coeff[i * n + j] = 1;
            }
            constraints.add(new LinearConstraint(coeff, Relationship.EQ, supplies[i]));
        }

        // 2. По потребностям: sum_i x_ij = demand_j
        for (int j = 0; j < n; j++) {
            double[] coeff = new double[numVars];
            for (int i = 0; i < m; i++) {
                coeff[i * n + j] = 1;
            }
            constraints.add(new LinearConstraint(coeff, Relationship.EQ, needs[j]));
        }

        // Все переменные >= 0
        NonNegativeConstraint nonNegative = new NonNegativeConstraint(true);

        // Максимальное количество итераций
        SimplexSolver solver = new SimplexSolver();

        PointValuePair solution = solver.optimize(
                new MaxIter(100),
                f,
                new LinearConstraintSet(constraints),
                GoalType.MINIMIZE,
                nonNegative
        );

        double[] values = solution.getPoint();

        System.out.println("Оптимальное решение:");
        int totalCost = 0;
        for (int i = 0; i < m; i++) {
            System.out.print("Поставщик " + (i + 1) + ": ");
            for (int j = 0; j < n; j++) {
                double amount = values[i * n + j];
                totalCost += matrix[i][j] * amount;
                System.out.printf("%6.2f ", amount);
            }
            System.out.println();
        }

        System.out.println("Общая стоимость перевозки: " + totalCost);

        return new Solution(task.getId(), task, matrix, totalCost);
    }
}
