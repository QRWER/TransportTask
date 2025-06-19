package com.softlink.springboot.transport_task.simplex_method;

import com.softlink.springboot.transport_task.entity.Solution;
import com.softlink.springboot.transport_task.entity.TransportTask;
import org.apache.commons.math3.optim.*;
import org.apache.commons.math3.optim.linear.*;
import org.apache.commons.math3.optim.nonlinear.scalar.GoalType;
import org.apache.commons.math3.optim.linear.LinearConstraintSet;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public interface Solver {
    static Solution solveTransportationProblem(TransportTask task)  {
        int[][] matrix = task.getMatrix();
        int[] supplies = task.getSupplies();
        int[] needs = task.getNeeds();

        int difference = Arrays.stream(needs).sum() - Arrays.stream(supplies).sum();

        if(difference > 0) {
            int[] newSupplies = new int[supplies.length + 1];
            System.arraycopy(supplies, 0, newSupplies, 0, supplies.length);
            newSupplies[supplies.length] = difference;
            supplies = newSupplies;
            int[][] newMatrix = new int[supplies.length][];
            for(int i = 0; i < supplies.length-1; i++) {
                newMatrix[i] = matrix[i].clone();
            }
            newMatrix[supplies.length-1] = new int[needs.length];
            matrix = newMatrix;
        }
        else {
            int[] newNeeds = new int[needs.length + 1];
            System.arraycopy(needs, 0, newNeeds, 0, needs.length);
            newNeeds[needs.length] = -difference;
            needs = newNeeds;
            int[][] newMatrix = new int[supplies.length][needs.length];
            for(int i = 0; i < supplies.length; i++) {
                System.arraycopy(matrix[i], 0, newMatrix[i], 0, matrix[i].length);
            }
            matrix = newMatrix;
        }

        int m = supplies.length;
        int n = needs.length;

        int numVars = m * n;

        double[] coefficients = new double[numVars];
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                coefficients[i * n + j] = matrix[i][j];
            }
        }

        LinearObjectiveFunction f = new LinearObjectiveFunction(coefficients, 0);

        List<LinearConstraint> constraints = new ArrayList<>();

        for (int i = 0; i < m; i++) {
            double[] coeff = new double[numVars];
            for (int j = 0; j < n; j++) {
                coeff[i * n + j] = 1;
            }
            constraints.add(new LinearConstraint(coeff, Relationship.EQ, supplies[i]));
        }

        for (int j = 0; j < n; j++) {
            double[] coeff = new double[numVars];
            for (int i = 0; i < m; i++) {
                coeff[i * n + j] = 1;
            }
            constraints.add(new LinearConstraint(coeff, Relationship.EQ, needs[j]));
        }

        NonNegativeConstraint nonNegative = new NonNegativeConstraint(true);

        SimplexSolver solver = new SimplexSolver();


        try {
            PointValuePair solution = solver.optimize(
                    new MaxIter(100),
                    f,
                    new LinearConstraintSet(constraints),
                    GoalType.MINIMIZE,
                    nonNegative
            );
            double[] values = solution.getPoint();

            int[][] amounts = new int[m][n];
            System.out.println("Оптимальное решение:");
            int totalCost = 0;
            for (int i = 0; i < m; i++) {
                System.out.print("Поставщик " + (i + 1) + ": ");
                for (int j = 0; j < n; j++) {
                    amounts[i][j] = (int)values[i * n + j];
                    totalCost += matrix[i][j] * amounts[i][j];
                    System.out.print(amounts[i][j] + " ");
                }
                System.out.println();
            }

            System.out.println("Общая стоимость перевозки: " + totalCost);

            return new Solution(task.getId(), amounts, totalCost);
        } catch (NoFeasibleSolutionException e) {
            return new Solution(task.getId(), new int[0][0], 0);
        }
    }
}
